interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

interface StoredToken {
  token: string;
  expiresAt: number;
  createdAt: number;
}

class ExternalTokenService {
  private static instance: ExternalTokenService;
  private tokenStore: Map<string, StoredToken> = new Map();

  private readonly CLIENT_ID = process.env.EXTERNAL_API_CLIENT_ID;
  private readonly CLIENT_SECRET = process.env.EXTERNAL_API_CLIENT_SECRET;
  private readonly TOKEN_URL =
    process.env.EXTERNAL_TOKEN_URL ||
    "https://staging.bhutanndi.com/authentication/authenticate";

  private constructor() {}

  static getInstance(): ExternalTokenService {
    if (!ExternalTokenService.instance) {
      ExternalTokenService.instance = new ExternalTokenService();
    }
    return ExternalTokenService.instance;
  }

  /**
   * Generate a new external API token
   */
  private async generateToken(): Promise<TokenResponse> {
    if (!this.CLIENT_ID || !this.CLIENT_SECRET) {
      throw new Error("External API credentials not configured");
    }

    const response = await fetch(this.TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Token generation failed:", errorData);
      throw new Error(`Failed to generate external token: ${response.status}`);
    }

    const tokenData: TokenResponse = await response.json();
    return tokenData;
  }

  /**
   * Get a valid external token (generates new one if needed)
   */
  async getValidToken(userId: string): Promise<string> {
    const stored = this.tokenStore.get(userId);
    const now = Date.now();

    // Check if we have a valid stored token (with 5-minute buffer)
    if (stored && stored.expiresAt > now + 5 * 60 * 1000) {
      return stored.token;
    }

    // Generate new token
    const tokenResponse = await this.generateToken();

    // Store the token
    const expiresAt = now + tokenResponse.expires_in * 1000;
    this.tokenStore.set(userId, {
      token: tokenResponse.access_token,
      expiresAt,
      createdAt: now,
    });

    return tokenResponse.access_token;
  }

  /**
   * Clear stored token for a user (useful for logout)
   */
  clearToken(userId: string): void {
    this.tokenStore.delete(userId);
  }

  /**
   * Clear all stored tokens
   */
  clearAllTokens(): void {
    this.tokenStore.clear();
  }

  /**
   * Check if token exists and is valid
   */
  hasValidToken(userId: string): boolean {
    const stored = this.tokenStore.get(userId);
    if (!stored) return false;

    const now = Date.now();
    return stored.expiresAt > now + 5 * 60 * 1000; // 5-minute buffer
  }

  /**
   * Get token info (for debugging)
   */
  getTokenInfo(userId: string): StoredToken | null {
    return this.tokenStore.get(userId) || null;
  }
}

// Export singleton instance
export const externalTokenService = ExternalTokenService.getInstance();
