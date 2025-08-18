"use client";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/lib/toast-context";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrganizationData } from "@/hooks/useOrganizationData";

import {
  Loader2,
  CreditCard,
  Activity,
  DollarSign,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getMockSubscriptionData,
  getOrganizationDisplayName,
} from "@/lib/mock-subscription-data";

export default function OrganizationOverviewPage() {
  const { user, loading, error, isAuthenticated } = useAuth({
    requiredRole: "ORGANIZATION_ADMIN",
  });
  const { showToast } = useToast();
  const router = useRouter();

  // Fetch real organization data
  const {
    organizationName,
    organizationStatus,
    loading: orgLoading,
    error: orgError,
  } = useOrganizationData(user?.orgId);

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

  // Loading state
  if (loading || orgLoading) {
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
  // Show organization error but don't block the page
  if (orgError) {
    showToast({
      type: "error",
      title: "Organization Data Error",
      message:
        "Failed to load organization details. Some information may be incomplete.",
      duration: 5000,
    });
  }

  // Get subscription data for the organization
  const subscriptionData = getMockSubscriptionData(user.orgId);

  // Override organization name and status with real data if available
  const enhancedSubscriptionData = {
    ...subscriptionData,
    organizationName: organizationName || subscriptionData.organizationName,
    status:
      organizationStatus === "ACTIVE"
        ? ("active" as const)
        : ("inactive" as const),
  };
  // Calculate summary metrics
  const totalUsage =
    subscriptionData.singleSignaturesUsed +
    subscriptionData.multipleSignaturesUsed;
  const totalUsageCost =
    subscriptionData.singleSignaturesUsed *
      subscriptionData.currentRates.singleSignaturePrice +
    subscriptionData.multipleSignaturesUsed *
      subscriptionData.currentRates.multipleSignaturePrice;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "low_balance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

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
        userRole="ORGANIZATION_ADMIN"
        user={user}
        onLogout={handleLogout}
        variant="inset"
      />
      <SidebarInset>
        <SiteHeader
          user={user}
          breadcrumbItems={[
            { title: "Organization", href: "/dashboard/organization" },
            { title: "Overview" },
          ]}
        />

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 py-6">
            <div className="px-4 lg:px-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Welcome, {enhancedSubscriptionData.organizationName} Admin
                  </h1>
                  <p className="text-muted-foreground">
                    Overview of your digital signature services and usage
                  </p>
                </div>
                <Button
                  onClick={() =>
                    router.push("/dashboard/organization/usage-billing")
                  }
                  className="gap-2"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                {/* Subscription Status */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Organization Status
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge
                        variant="secondary"
                        className={`${getStatusColor(
                          enhancedSubscriptionData.status
                        )} gap-1`}
                      >
                        {getStatusIcon(enhancedSubscriptionData.status)}
                        {enhancedSubscriptionData.status.toUpperCase()}
                      </Badge>
                      <div>
                        <div className="text-2xl font-bold capitalize">
                          {enhancedSubscriptionData.subscriptionType}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {enhancedSubscriptionData.subscriptionType ===
                          "prepaid"
                            ? `Balance: Nu. ${
                                enhancedSubscriptionData.remainingBalance?.toLocaleString() ||
                                0
                              }`
                            : `Current Bill: Nu. ${
                                enhancedSubscriptionData.currentBillAmount?.toLocaleString() ||
                                0
                              }`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Summary */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Usage
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {totalUsage.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Signatures processed
                    </p>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Single:</span>
                        <span>
                          {subscriptionData.singleSignaturesUsed.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Multiple:</span>
                        <span>
                          {subscriptionData.multipleSignaturesUsed.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Cost */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Usage Cost
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      Nu. {totalUsageCost.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total charges incurred
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>12% increase from last month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Rates */}
                <Card className="border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Current Rates
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <div className="text-lg font-bold">
                          Nu.{" "}
                          {subscriptionData.currentRates.singleSignaturePrice}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Per single signature
                        </p>
                      </div>
                      <div className="pt-2 border-t border-neutral-300">
                        <div className="text-lg font-bold">
                          Nu.{" "}
                          {subscriptionData.currentRates.multipleSignaturePrice}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Per multiple signature
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Access detailed information and reports
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div
                      className="p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200 hover:border-blue-300"
                      onClick={() =>
                        router.push(
                          "/dashboard/organization/usage-billing?tab=subscription"
                        )
                      }
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          Subscription Details
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">
                        View subscription status and details
                      </p>
                    </div>

                    <div
                      className="p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors cursor-pointer border border-green-200 hover:border-green-300"
                      onClick={() =>
                        router.push(
                          "/dashboard/organization/usage-billing?tab=usage"
                        )
                      }
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">
                          Usage Analytics
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        Track usage metrics and trends
                      </p>
                    </div>

                    <div
                      className="p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer border border-purple-200 hover:border-purple-300"
                      onClick={() =>
                        router.push(
                          "/dashboard/organization/usage-billing?tab=rates"
                        )
                      }
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-purple-900">
                          Billing Rates
                        </span>
                      </div>
                      <p className="text-sm text-purple-700">
                        Current pricing and rate comparison
                      </p>
                    </div>

                    <div
                      className="p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer border border-orange-200 hover:border-orange-300"
                      onClick={() =>
                        router.push(
                          "/dashboard/organization/usage-billing?tab=statistics"
                        )
                      }
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-orange-900">
                          Usage Statistics
                        </span>
                      </div>
                      <p className="text-sm text-orange-700">
                        Detailed usage insights and reports
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
