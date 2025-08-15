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

  // New edit functionality
  editOrganization: (
    orgId: string,
    data: CreateOrganizationData
  ) => Promise<EditOrganizationResult>;

  // Existing fetch functionality
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

interface EditOrganizationResult {
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
          credentials: "include",
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

  // New edit organization functionality
  const editOrganization = useCallback(
    async (
      orgId: string,
      data: CreateOrganizationData
    ): Promise<EditOrganizationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/organizations/${orgId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        });

        const result: ApiResponse = await response.json();

        if (!response.ok) {
          const errorMessage =
            result.message || "Failed to update organization";
          setError(errorMessage);
          return {
            success: false,
            message: errorMessage,
            errors: result.errors,
          };
        }

        // Optionally update local state
        setOrganizations((prev) =>
          prev.map((org) =>
            org.orgId === orgId
              ? {
                  ...org,
                  ...data,
                  status: data.status.toLowerCase() as "active" | "inactive",
                }
              : org
          )
        );

        return {
          success: true,
          message: result.message || "Organization updated successfully",
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

  // Existing fetch all organizations functionality
  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/organizations", {
        method: "GET",
        credentials: "include",
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || "Failed to fetch organizations";
        setError(errorMessage);
        return;
      }

      setOrganizations(result.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to connect to the server. Please check your internet connection and try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Existing refetch functionality
  const refetch = useCallback(async () => {
    await fetchOrganizations();
  }, [fetchOrganizations]);

  // Existing local state update functionality
  const updateOrganization = useCallback(
    (orgId: string, updatedData: Partial<OrganizationDisplay>) => {
      setOrganizations((prev) =>
        prev.map((org) =>
          org.orgId === orgId ? { ...org, ...updatedData } : org
        )
      );
    },
    []
  );

  return {
    // Create functionality
    createOrganization,

    // Edit functionality
    editOrganization,

    // Fetch functionality
    organizations,
    fetchOrganizations,
    refetch,
    updateOrganization,

    // State
    isLoading,
    error,
    clearError,
  };
}
