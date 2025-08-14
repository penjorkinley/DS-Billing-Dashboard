// hooks/useOrganizations.ts
import { useState, useCallback, useEffect } from "react";
import {
  CreateOrganizationData,
  OrganizationDisplay,
} from "@/lib/schemas/organization";

interface UseOrganizationsReturn {
  // Existing create functionality
  createOrganization: (
    data: CreateOrganizationData
  ) => Promise<CreateOrganizationResult>;

  // New fetch functionality
  organizations: OrganizationDisplay[];
  fetchOrganizations: () => Promise<void>;
  refetch: () => Promise<void>;
  updateOrganization: (
    orgId: string,
    updatedData: Partial<OrganizationDisplay>
  ) => void;

  // Shared state
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
  const [organizations, setOrganizations] = useState<OrganizationDisplay[]>([]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Existing create organization functionality
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

  // New fetch organizations functionality
  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/organizations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Failed to fetch organizations: ${response.status}`
        );
      }

      // Data is already converted to display format by the API route
      setOrganizations(result.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch organizations";
      setError(errorMessage);
      console.error("Error fetching organizations:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchOrganizations();
  }, [fetchOrganizations]);

  // Update organization locally (for optimistic updates)
  const updateOrganization = useCallback(
    (orgId: string, updatedData: Partial<OrganizationDisplay>) => {
      setOrganizations((prev: OrganizationDisplay[]) =>
        prev.map((org) =>
          org.orgId === orgId ? { ...org, ...updatedData } : org
        )
      );
    },
    []
  );

  return {
    // Existing functionality
    createOrganization,

    // New functionality
    organizations,
    fetchOrganizations,
    refetch,
    updateOrganization,

    // Shared state
    isLoading,
    error,
    clearError,
  };
}
