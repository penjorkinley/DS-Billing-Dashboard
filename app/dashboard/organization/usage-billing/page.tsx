"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/lib/toast-context";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Activity,
  DollarSign,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Calendar,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";

// Import your existing components
import { PrepaidSubscriptionDetails } from "@/components/subscription/prepaid-subscription-details";
import { PostpaidSubscriptionDetails } from "@/components/subscription/postpaid-subscription-details";
import { UsageMetrics } from "@/components/subscription/usage-metrics";
import { BillingInformation } from "@/components/subscription/billing-information";
import {
  getMockSubscriptionData,
  getOrganizationDisplayName,
} from "@/lib/mock-subscription-data";

export default function UsageBillingDetailsPage() {
  const { user, loading, error, isAuthenticated } = useAuth({
    requiredRole: "ORGANIZATION_ADMIN",
  });
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("subscription");

  // Get initial tab from URL params
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["subscription", "usage", "rates", "statistics"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
  if (loading) {
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

  // Get subscription data
  const subscriptionData = getMockSubscriptionData(user.orgId);

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

  // Mock statistics data
  const statsData = {
    dailyAverage: 47,
    weeklyTotal: 329,
    monthlyTotal: 1420,
    peakUsageDay: "Tuesday",
    mostUsedService: "Single Signatures",
    usageGrowth: 12.5,
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
            { title: "Usage & Billing" },
          ]}
        />

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 py-6">
            <div className="px-4 lg:px-6">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                  Usage & Billing Details
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive view of your organization's subscription, usage,
                  and billing information
                </p>
              </div>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/30 rounded-lg h-auto">
                  <TabsTrigger
                    value="subscription"
                    className="gap-2 cursor-pointer py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 hover:bg-muted/50 rounded-md"
                  >
                    <CreditCard className="h-4 w-4" />
                    Subscription
                  </TabsTrigger>
                  <TabsTrigger
                    value="usage"
                    className="gap-2 cursor-pointer py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 hover:bg-muted/50 rounded-md"
                  >
                    <Activity className="h-4 w-4" />
                    Usage Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="rates"
                    className="gap-2 cursor-pointer py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 hover:bg-muted/50 rounded-md"
                  >
                    <DollarSign className="h-4 w-4" />
                    Billing Rates
                  </TabsTrigger>
                  <TabsTrigger
                    value="statistics"
                    className="gap-2 cursor-pointer py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 hover:bg-muted/50 rounded-md"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Usage Statistics
                  </TabsTrigger>
                </TabsList>

                {/* Subscription Tab */}
                <TabsContent value="subscription" className="space-y-6">
                  <div className="grid gap-6">
                    {/* Subscription Status Card */}
                    <Card className="border-0 shadow-md">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">
                                {subscriptionData.organizationName}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {subscriptionData.subscriptionType === "prepaid"
                                  ? "Prepaid Plan"
                                  : "Postpaid Plan"}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`${getStatusColor(
                              subscriptionData.status
                            )} gap-1`}
                          >
                            {getStatusIcon(subscriptionData.status)}
                            {subscriptionData.status
                              .replace("_", " ")
                              .toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* Detailed Subscription Information */}
                    {subscriptionData.subscriptionType === "prepaid" ? (
                      <PrepaidSubscriptionDetails
                        subscriptionData={subscriptionData}
                      />
                    ) : (
                      <PostpaidSubscriptionDetails
                        subscriptionData={subscriptionData}
                      />
                    )}
                  </div>
                </TabsContent>

                {/* Usage Overview Tab */}
                <TabsContent value="usage" className="space-y-6">
                  <UsageMetrics subscriptionData={subscriptionData} />

                  {/* Simple Usage Chart Placeholder */}
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle>Usage Trends</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Monthly usage pattern over the last 6 months
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Usage chart visualization
                          </p>
                          <p className="text-xs text-muted-foreground">
                            (Chart integration will be added)
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Billing Rates Tab */}
                <TabsContent value="rates" className="space-y-6">
                  <BillingInformation
                    currentRates={subscriptionData.currentRates}
                  />

                  {/* Rate Comparison Card */}
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle>Rate Comparison</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Current rates vs previous period
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Single Signature</p>
                            <p className="text-2xl font-bold">
                              Nu.{" "}
                              {
                                subscriptionData.currentRates
                                  .singleSignaturePrice
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              vs previous
                            </p>
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <TrendingDown className="h-3 w-3" />
                              <span>No change</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Multiple Signature</p>
                            <p className="text-2xl font-bold">
                              Nu.{" "}
                              {
                                subscriptionData.currentRates
                                  .multipleSignaturePrice
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              vs previous
                            </p>
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <TrendingDown className="h-3 w-3" />
                              <span>No change</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Usage Statistics Tab */}
                <TabsContent value="statistics" className="space-y-6">
                  {/* Statistics Overview */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium">Daily Average</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          {statsData.dailyAverage}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          signatures per day
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium">Weekly Total</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          {statsData.weeklyTotal}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          this week
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium">Monthly Total</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          {statsData.monthlyTotal}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          this month
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium">Growth Rate</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          +{statsData.usageGrowth}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          vs last month
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Statistics */}
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle>Usage Insights</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Detailed breakdown of your usage patterns
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h4 className="font-medium mb-3">
                            Usage Distribution
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Single Signatures</span>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full w-3/4 bg-primary rounded-full"></div>
                                </div>
                                <span className="text-sm font-medium">75%</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">
                                Multiple Signatures
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full w-1/4 bg-secondary rounded-full"></div>
                                </div>
                                <span className="text-sm font-medium">25%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Key Metrics</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Peak Usage Day
                              </span>
                              <span className="text-sm font-medium">
                                {statsData.peakUsageDay}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Most Used Service
                              </span>
                              <span className="text-sm font-medium">
                                {statsData.mostUsedService}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Last Activity
                              </span>
                              <span className="text-sm font-medium">
                                {subscriptionData.lastUsageDate
                                  ? new Date(
                                      subscriptionData.lastUsageDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Charts Placeholder */}
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle>Usage Analytics Charts</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Visual representation of your usage data
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg">
                          <div className="text-center">
                            <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Usage by Service Type
                            </p>
                          </div>
                        </div>
                        <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg">
                          <div className="text-center">
                            <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Usage Timeline
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
