"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/lib/toast-context";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Building2, RefreshCw } from "lucide-react";

// Import updated components
import { OrganizationCard } from "@/components/organization/organization-card";
import { OrganizationStats } from "@/components/organization/organization-stats";
import { OrganizationFilters } from "@/components/organization/organization-filters";
import { OrganizationTableView } from "@/components/organization/organization-table-view";
import {
  type OrganizationDisplay,
  type EditOrganizationData,
} from "@/lib/schemas/organization";

// Import the updated organizations hook
import { useOrganizations } from "@/hooks/useOrganizations";

export default function OrganizationsPage() {
  const {
    user,
    loading: authLoading,
    error: authError,
    isAuthenticated,
  } = useAuth({
    requiredRole: "SUPER_ADMIN",
  });
  const router = useRouter();
  const { showToast } = useToast();

  // Organizations data management
  const {
    organizations,
    isLoading: orgsLoading,
    error: orgsError,
    fetchOrganizations,
    refetch,
    updateOrganization,
  } = useOrganizations();

  // UI state management
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  // Fetch organizations on mount
  useEffect(() => {
    if (user && isAuthenticated) {
      fetchOrganizations();
    }
  }, [user, isAuthenticated]);

  // Show error toast when organizations fail to load
  useEffect(() => {
    if (orgsError) {
      showToast({
        type: "error",
        title: "Failed to Load Organizations",
        message: orgsError,
        duration: 5000,
      });
    }
  }, [orgsError, showToast]);

  // Filter organizations based on search and status
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.orgId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.webhookId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || org.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [organizations, searchQuery, statusFilter]);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        showToast({
          type: "success",
          title: "Logged Out",
          message: "You have been successfully logged out. Redirecting...",
          duration: 2000,
        });
        setTimeout(() => (window.location.href = "/login"), 1500);
      }
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  // Handle organization update
  const handleOrganizationUpdate = (
    orgId: string,
    updatedData: EditOrganizationData
  ) => {
    updateOrganization(orgId, {
      ...updatedData,
      status: updatedData.status as "active" | "inactive",
    });

    showToast({
      type: "success",
      title: "Organization Updated",
      message: "Organization details have been successfully updated.",
      duration: 3000,
    });
  };

  // Handle card flip
  const handleCardClick = (orgId: string) => {
    setFlippedCards((prev) => {
      const newFlipped = new Set(prev);
      if (newFlipped.has(orgId)) {
        newFlipped.delete(orgId);
      } else {
        newFlipped.add(orgId);
      }
      return newFlipped;
    });
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  // Handle refresh
  const handleRefresh = async () => {
    await refetch();
    showToast({
      type: "success",
      title: "Refreshed",
      message: "Organizations data has been refreshed.",
      duration: 2000,
    });
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (authError || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {authError || "Authentication failed"}
          </p>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "280px",
          "--header-height": "60px",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        userRole="SUPER_ADMIN"
        user={user}
        onLogout={handleLogout}
        variant="inset"
      />
      <SidebarInset>
        <SiteHeader
          user={user}
          breadcrumbItems={[
            { title: "Super Administrator", href: "/dashboard/super-admin" },
            {
              title: "Organizations",
              href: "/dashboard/super-admin/organizations",
            },
            { title: "All Organizations" },
          ]}
        />

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 py-6">
            {/* Header Section */}
            <div className="px-4 lg:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    All Organizations
                  </h1>
                  <p className="text-muted-foreground">
                    Manage and monitor all organizations in your system. Click
                    on cards to view subscription details.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={orgsLoading}
                    className="border-gray-200"
                  >
                    {orgsLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                  <Button
                    className="w-fit bg-green-600 hover:bg-green-700 text-white border-0"
                    onClick={() => router.push("/dashboard/super-admin/create")}
                  >
                    Add Organization
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="px-4 lg:px-6">
              <OrganizationStats organizations={organizations} />
            </div>

            {/* Filters and Controls */}
            <div className="px-4 lg:px-6">
              <OrganizationFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalCount={organizations.length}
                filteredCount={filteredOrganizations.length}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Organizations Display */}
            <div className="px-4 lg:px-6">
              {orgsLoading ? (
                <Card className="py-12 border-0 shadow-lg">
                  <CardContent className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Loading Organizations
                    </h3>
                    <p className="text-muted-foreground">
                      Fetching organization data from the server...
                    </p>
                  </CardContent>
                </Card>
              ) : orgsError ? (
                <Card className="py-12 border-0 shadow-lg">
                  <CardContent className="text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-red-600">
                      Failed to Load Organizations
                    </h3>
                    <p className="text-muted-foreground mb-4">{orgsError}</p>
                    <Button variant="outline" onClick={handleRefresh}>
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              ) : filteredOrganizations.length === 0 &&
                organizations.length === 0 ? (
                <Card className="py-12 border-0 shadow-lg">
                  <CardContent className="text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Organizations Found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Get started by adding your first organization.
                    </p>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white border-0"
                      onClick={() =>
                        router.push("/dashboard/super-admin/create")
                      }
                    >
                      Add Organization
                    </Button>
                  </CardContent>
                </Card>
              ) : filteredOrganizations.length === 0 ? (
                <Card className="py-12 border-0 shadow-lg">
                  <CardContent className="text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No organizations match your filters
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or filter criteria.
                    </p>
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear filters
                    </Button>
                  </CardContent>
                </Card>
              ) : viewMode === "grid" ? (
                /* Grid View with Flip Cards */
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredOrganizations.map((org) => (
                    <OrganizationCard
                      key={org.orgId}
                      organization={org}
                      isFlipped={flippedCards.has(org.orgId)}
                      onCardClick={() => handleCardClick(org.orgId)}
                      onUpdate={handleOrganizationUpdate}
                    />
                  ))}
                </div>
              ) : (
                /* Table View */
                <OrganizationTableView
                  organizations={filteredOrganizations}
                  onUpdate={handleOrganizationUpdate}
                />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
