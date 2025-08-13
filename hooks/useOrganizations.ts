import { useState, useCallback } from "react";
import { CreateOrganizationData } from "@/lib/schemas/organization";

interface UseOrganizationsReturn {
  createOrganization: (
    data: CreateOrganizationData
  ) => Promise<CreateOrganizationResult>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

interface CreateOrganizationResult {
  success: boolean;
  message: string;
  data?: any;
  errors?: Array<{ field: string; message: string }>;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: Array<{ field: string; message: string }>;
}

export function useOrganizations(): UseOrganizationsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createOrganization = useCallback(
    async (data: CreateOrganizationData): Promise<CreateOrganizationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/organizations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include", // Important for cookie-based auth
        });

        const result: ApiResponse = await response.json();

        if (!response.ok) {
          const errorMessage =
            result.message || "Failed to create organization";
          setError(errorMessage);
          return {
            success: false,
            message: errorMessage,
            errors: result.errors,
          };
        }

        return {
          success: true,
          message: result.message || "Organization created successfully",
          data: result.data,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to connect to the server. Please check your internet connection and try again.";

        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    createOrganization,
    isLoading,
    error,
    clearError,
  };
}
