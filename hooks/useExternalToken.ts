import { useState, useCallback, useEffect } from "react";

interface TokenInfo {
  expiresAt: number;
  createdAt: number;
  isExpiring: boolean;
}

interface ExternalTokenStatus {
  hasValidToken: boolean;
  tokenInfo: TokenInfo | null;
}

interface UseExternalTokenReturn {
  generateToken: () => Promise<{ success: boolean; message: string }>;
  checkTokenStatus: () => Promise<ExternalTokenStatus | null>;
  clearToken: () => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
  error: string | null;
  tokenStatus: ExternalTokenStatus | null;
  clearError: () => void;
}

export function useExternalToken(): UseExternalTokenReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<ExternalTokenStatus | null>(
    null
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/external-token", {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message);
        return {
          success: false,
          message: result.message,
        };
      }

      // Update token status after successful generation
      setTokenStatus(result.data);

      return {
        success: true,
        message: result.message,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to generate external token";

      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkTokenStatus =
    useCallback(async (): Promise<ExternalTokenStatus | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/external-token", {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.message);
          return null;
        }

        setTokenStatus(result.data);
        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to check token status";

        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    }, []);

  const clearToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/external-token", {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message);
        return {
          success: false,
          message: result.message,
        };
      }

      // Clear local token status
      setTokenStatus(null);

      return {
        success: true,
        message: result.message,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to clear external token";

      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-check token status on mount
  useEffect(() => {
    checkTokenStatus();
  }, [checkTokenStatus]);

  return {
    generateToken,
    checkTokenStatus,
    clearToken,
    isLoading,
    error,
    tokenStatus,
    clearError,
  };
}
