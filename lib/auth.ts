import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db";

export interface JWTPayload {
  id: number;
  userid: string;
  role: string;
  orgId: string | null;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    userid: string;
    role: string;
    orgId: string | null;
  };
}

export interface CreateUserResult {
  success: boolean;
  message: string;
  user?: {
    id: number;
    userid: string;
    role: string;
    orgId: string | null;
    createdAt: Date;
  };
}

// Rate limiting storage (in production, use Redis or similar)
const authAttempts = new Map<string, { count: number; resetTime: number }>();

export class AuthService {
  // Validate that JWT_SECRET exists and is sufficiently strong
  private static readonly JWT_SECRET = (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is required");
    }
    if (secret.length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters long");
    }
    return secret;
  })();

  private static readonly JWT_EXPIRES_IN = "24h";
  private static readonly MAX_AUTH_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  /** Hash a plaintext password */
  static async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new Error("Password is required");
    }
    return bcrypt.hash(password, 12);
  }

  /** Compare plaintext to hashed password */
  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    if (!password || !hashedPassword) {
      return false;
    }
    return bcrypt.compare(password, hashedPassword);
  }

  /** Generate a signed JWT */
  static generateToken(payload: JWTPayload): string {
    if (!payload.id || !payload.userid || !payload.role) {
      throw new Error("Invalid payload for token generation");
    }

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
      issuer: "bhutan-ndi",
      audience: "billing-dashboard",
    });
  }

  /** Verify a JWT and return its payload or null */
  static verifyToken(token: string): JWTPayload | null {
    if (!token) {
      return null;
    }

    try {
      const payload = jwt.verify(token, this.JWT_SECRET, {
        issuer: "bhutan-ndi",
        audience: "billing-dashboard",
      }) as JWTPayload;

      // Additional payload validation
      if (!payload.id || !payload.userid || !payload.role) {
        return null;
      }

      return payload;
    } catch (error) {
      // Log specific error types for monitoring
      if (error instanceof jwt.TokenExpiredError) {
        console.warn("Token expired:", error.expiredAt);
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.warn("Invalid token:", error.message);
      } else {
        console.error("Token verification error:", error);
      }
      return null;
    }
  }

  /** Check if user is rate limited */
  private static isRateLimited(identifier: string): boolean {
    const attempts = authAttempts.get(identifier);
    if (!attempts) return false;

    const now = Date.now();
    if (now > attempts.resetTime) {
      authAttempts.delete(identifier);
      return false;
    }

    return attempts.count >= this.MAX_AUTH_ATTEMPTS;
  }

  /** Record failed authentication attempt */
  private static recordFailedAttempt(identifier: string): void {
    const now = Date.now();
    const attempts = authAttempts.get(identifier);

    if (!attempts || now > attempts.resetTime) {
      authAttempts.set(identifier, {
        count: 1,
        resetTime: now + this.LOCKOUT_DURATION,
      });
    } else {
      attempts.count += 1;
    }
  }

  /** Clear successful authentication attempts */
  private static clearFailedAttempts(identifier: string): void {
    authAttempts.delete(identifier);
  }

  /** Authenticate a user and return a JWT on success */
  static async authenticateUser(
    userid: string,
    password: string,
    clientIdentifier?: string
  ): Promise<AuthResult> {
    try {
      // Input validation
      if (!userid?.trim() || !password) {
        return { success: false, message: "Invalid credentials provided" };
      }

      // Rate limiting check
      const identifier = clientIdentifier || userid;
      if (this.isRateLimited(identifier)) {
        return {
          success: false,
          message: "Too many failed attempts. Please try again later.",
        };
      }

      // Find user
      const user = await db.user.findUnique({
        where: { userid: userid.trim() },
        select: {
          id: true,
          userid: true,
          password: true,
          role: true,
          orgId: true,
        },
      });

      if (!user) {
        this.recordFailedAttempt(identifier);
        return { success: false, message: "Invalid credentials" };
      }

      // Verify password
      const valid = await this.comparePassword(password, user.password);
      if (!valid) {
        this.recordFailedAttempt(identifier);
        return { success: false, message: "Invalid credentials" };
      }

      // Clear failed attempts on successful login
      this.clearFailedAttempts(identifier);

      // Generate token
      const token = this.generateToken({
        id: user.id,
        userid: user.userid,
        role: user.role,
        orgId: user.orgId,
      });

      return {
        success: true,
        message: "Authentication successful",
        token,
        user: {
          id: user.id,
          userid: user.userid,
          role: user.role,
          orgId: user.orgId,
        },
      };
    } catch (error) {
      console.error("Authentication error:", error);
      return { success: false, message: "Authentication failed" };
    }
  }

  /** Create a new user with role-based orgId validation */
  static async createUser(
    userid: string,
    password: string,
    role: "SUPER_ADMIN" | "ORGANIZATION_ADMIN",
    orgId: string | null = null
  ): Promise<CreateUserResult> {
    try {
      // Input validation
      if (!userid?.trim()) {
        return { success: false, message: "User ID is required" };
      }

      if (!password || password.length < 8) {
        return {
          success: false,
          message: "Password must be at least 8 characters long",
        };
      }

      if (!role || !["SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(role)) {
        return { success: false, message: "Invalid role specified" };
      }

      // Role-specific validation
      if (role === "ORGANIZATION_ADMIN" && !orgId?.trim()) {
        return {
          success: false,
          message: "Organization ID is required for Organization Admin",
        };
      }

      if (role === "SUPER_ADMIN") {
        orgId = null; // Ensure super admin has no org restriction
      }

      // Check for existing user
      const existing = await db.user.findUnique({
        where: { userid: userid.trim() },
      });

      if (existing) {
        return { success: false, message: "User already exists" };
      }

      // Hash password and create user
      const hashedPassword = await this.hashPassword(password);
      const user = await db.user.create({
        data: {
          userid: userid.trim(),
          password: hashedPassword,
          role,
          orgId: orgId?.trim() || null,
        },
        select: {
          id: true,
          userid: true,
          role: true,
          orgId: true,
          createdAt: true,
        },
      });

      return {
        success: true,
        message: "User created successfully",
        user,
      };
    } catch (error) {
      console.error("User creation error:", error);
      return { success: false, message: "User creation failed" };
    }
  }

  /** Validate user session */
  static async validateSession(token: string): Promise<JWTPayload | null> {
    if (!token) return null;

    const payload = this.verifyToken(token);
    if (!payload) return null;

    try {
      // Verify user still exists and is active
      const user = await db.user.findUnique({
        where: { id: payload.id },
        select: { id: true, userid: true, role: true, orgId: true },
      });

      if (!user) return null;

      // Ensure payload matches current user data
      if (
        user.userid !== payload.userid ||
        user.role !== payload.role ||
        user.orgId !== payload.orgId
      ) {
        return null;
      }

      return payload;
    } catch (error) {
      console.error("Session validation error:", error);
      return null;
    }
  }

  /** Refresh JWT token */
  static async refreshToken(currentToken: string): Promise<AuthResult> {
    try {
      const payload = await this.validateSession(currentToken);
      if (!payload) {
        return { success: false, message: "Invalid or expired token" };
      }

      // Generate new token
      const newToken = this.generateToken({
        id: payload.id,
        userid: payload.userid,
        role: payload.role,
        orgId: payload.orgId,
      });

      return {
        success: true,
        message: "Token refreshed successfully",
        token: newToken,
        user: {
          id: payload.id,
          userid: payload.userid,
          role: payload.role,
          orgId: payload.orgId,
        },
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      return { success: false, message: "Token refresh failed" };
    }
  }

  /** Clean up expired rate limit entries */
  static cleanupRateLimit(): void {
    const now = Date.now();
    for (const [key, value] of authAttempts.entries()) {
      if (now > value.resetTime) {
        authAttempts.delete(key);
      }
    }
  }
}
