// lib/api-config.ts
import { externalTokenService } from "./external-token-service";

export const API_CONFIG = {
  EXTERNAL_API: {
    BASE_URL: process.env.EXTERNAL_API_BASE_URL,
  },
  TIMEOUTS: {
    DEFAULT: 30000, // 30 seconds
    LONG_RUNNING: 60000, // 1 minute
  },
} as const;

// Response types for the external API
export interface ExternalApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface CreateOrganizationApiResponse {
  id?: string;
  name: string;
  webhookId: string;
  webhookUrl: string;
  status: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow additional properties from external API
}

// Helper function to make external API calls with dynamic token
export async function makeExternalApiCall<T>(
  endpoint: string,
  options: RequestInit,
  userId: string
): Promise<{ data: T; response: Response }> {
  const url = `${API_CONFIG.EXTERNAL_API.BASE_URL}${endpoint}`;

  // Get fresh external token for this user
  const externalToken = await externalTokenService.getValidToken(userId);

  const response = await fetch(url, {
    ...options,
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${externalToken}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  return { data, response };
}

// Error handling utility
export function handleExternalApiError(error: unknown): string {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return "Unable to connect to external service. Please try again later.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}
