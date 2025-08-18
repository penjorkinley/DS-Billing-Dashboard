// hooks/useOrganizationData.ts
import { useCallback, useEffect, useState } from "react";

interface OrganizationData {
  id: number;
  orgId: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  webhookId: string;
  webhookUrl: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
}

interface UseOrganizationDataReturn {
  organizationName: string | null;
  organizationStatus: "ACTIVE" | "INACTIVE" | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrganizationData(
  orgId?: string | null
): UseOrganizationDataReturn {
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [organizationStatus, setOrganizationStatus] = useState<
    "ACTIVE" | "INACTIVE" | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizationData = useCallback(async () => {
    if (!orgId) {
      setOrganizationName(null);
      setOrganizationStatus(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/organizations/${orgId}/details`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch organization details"
        );
      }

      if (result.data) {
        setOrganizationName(result.data.name);
        setOrganizationStatus(result.data.status);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Failed to fetch organization:", err);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchOrganizationData();
  }, [fetchOrganizationData]);

  return {
    organizationName,
    organizationStatus,
    loading,
    error,
    refetch: fetchOrganizationData,
  };
}
