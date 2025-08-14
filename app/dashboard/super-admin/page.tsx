"use client";

import { useAuth } from "@/hooks/useAuth";
import { useExternalToken } from "@/hooks/useExternalToken";
import { useToast } from "@/lib/toast-context";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function SuperAdminDashboard() {
  const { user, loading, error, isAuthenticated } = useAuth({
    requiredRole: "SUPER_ADMIN",
  });

  // Add external token management
  const {
    generateToken,
    tokenStatus,
    isLoading: tokenLoading,
    error: tokenError,
  } = useExternalToken();

  const { showToast } = useToast();

  // Track auto-generation state
  const [autoGeneratingToken, setAutoGeneratingToken] = useState(false);

  // Auto-generate external token on login if not present
  useEffect(() => {
    if (
      user &&
      tokenStatus !== null &&
      !tokenStatus.hasValidToken &&
      !autoGeneratingToken
    ) {
      setAutoGeneratingToken(true);
      generateToken()
        .then((result) => {
          if (!result.success) {
            showToast({
              type: "warning",
              title: "External Access Issue",
              message:
                "Unable to configure external API access. Some features may be limited.",
              duration: 5000,
            });
          }
        })
        .catch((err) => {
          console.error("Token generation error:", err);
          showToast({
            type: "warning",
            title: "External Access Issue",
            message:
              "External API configuration encountered an issue. Some features may be limited.",
            duration: 5000,
          });
        })
        .finally(() => {
          setAutoGeneratingToken(false);
        });
    }
  }, [user, tokenStatus, autoGeneratingToken, generateToken, showToast]);

  // logout function with external token cleanup
  const handleLogout = async () => {
    try {
      // Clear external token first (if available)
      try {
        await fetch("/api/external-token", {
          method: "DELETE",
          credentials: "include",
        });
        // console.log("External token cleared");
      } catch (tokenError) {
        // console.log(
        //   "External token cleanup failed (non-critical):",
        //   tokenError
        // );
      }

      // Original logout logic
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        showToast({
          type: "success",
          title: "Logged Out",
          message: "You have been successfully logged out. Redirecting...",
          duration: 2000,
        });

        // Small delay to show the toast before redirect
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        showToast({
          type: "error",
          title: "Logout Error",
          message: "Failed to logout properly. Redirecting anyway...",
        });

        // Still redirect even if logout API fails
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error) {
      console.error("Logout error:", error);
      showToast({
        type: "error",
        title: "Connection Error",
        message: "Failed to logout properly. Redirecting anyway...",
      });

      // Force redirect even if logout API fails
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  // Show loading state (includes token generation)
  if (loading || autoGeneratingToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
          <span className="text-muted-foreground">
            {loading
              ? "Verifying authentication..."
              : "Configuring external access..."}
          </span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error || "Authentication failed"}
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
            { title: "System Dashboard" },
          ]}
        />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 py-6">
            {/* Overview Cards */}
            <SectionCards userRole="SUPER_ADMIN" />

            {/* Charts Section */}
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive userRole="SUPER_ADMIN" />
            </div>

            {/* Data Table */}
            <div className="px-4 lg:px-6">
              <DataTable userRole="SUPER_ADMIN" />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
