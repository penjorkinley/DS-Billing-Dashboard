"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/lib/toast-context";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Settings,
  Calendar,
  Save,
  FileText,
} from "lucide-react";
import { z } from "zod";
import {
  billingConfigSchema,
  parseBillingValidationErrors,
  defaultBillingConfig,
  formatCurrency,
  calculateSignatureCost,
  BILLING_CYCLES,
  CYCLE_DISPLAY_MAP,
  REVENUE_MODELS,
  type PricingConfig,
  type BillingConfig,
  type BillingFormErrors,
} from "@/lib/schemas/billing";

export default function BillingConfigurationPage() {
  const { user, loading, error, isAuthenticated } = useAuth({
    requiredRole: "SUPER_ADMIN",
  });
  const { showToast } = useToast();

  // State management
  const [billingConfig, setBillingConfig] = useState<BillingConfig>({
    ...defaultBillingConfig,
    updatedBy: user?.userid || "",
  });
  const [formErrors, setFormErrors] = useState<BillingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update updatedBy when user is loaded
  useEffect(() => {
    if (user?.userid && !billingConfig.updatedBy) {
      setBillingConfig((prev) => ({ ...prev, updatedBy: user.userid }));
    }
  }, [user?.userid, billingConfig.updatedBy]);

  // Handle logout
  const handleLogout = async () => {
    try {
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
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        showToast({
          type: "error",
          title: "Logout Error",
          message: "Failed to logout properly. Redirecting anyway...",
        });
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
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  // Handle pricing changes
  const handlePricingChange = (field: keyof PricingConfig, value: number) => {
    setBillingConfig((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, [field]: value },
    }));

    // Clear field error when user starts typing
    if (formErrors[`pricing.${field}`]) {
      setFormErrors((prev) => ({ ...prev, [`pricing.${field}`]: "" }));
    }
  };

  // Handle billing cycle toggle
  const handleBillingCycleToggle = (cycle: string, checked: boolean) => {
    setBillingConfig((prev) => ({
      ...prev,
      enabledBillingCycles: checked
        ? [...prev.enabledBillingCycles, cycle as any]
        : prev.enabledBillingCycles.filter((c) => c !== cycle),
    }));

    // Clear error when user makes changes
    if (formErrors["enabledBillingCycles"]) {
      setFormErrors((prev) => ({ ...prev, enabledBillingCycles: "" }));
    }
  };

  // Validate configuration
  const validateConfiguration = (): boolean => {
    try {
      billingConfigSchema.parse(billingConfig);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = parseBillingValidationErrors(error);
        setFormErrors(errors);
      }
      return false;
    }
  };

  // Save configuration
  const saveConfiguration = async () => {
    if (!validateConfiguration()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Please fix the errors in the configuration before saving.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...billingConfig,
        updatedBy: user?.userid,
        updatedAt: new Date().toISOString(),
      };

      // Simulate API call (replace with actual API endpoint)
      console.log("Saving billing configuration:", payload);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showToast({
        type: "success",
        title: "Configuration Saved",
        message: "Billing configuration has been successfully updated.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving configuration:", error);
      showToast({
        type: "error",
        title: "Save Failed",
        message: "Failed to save billing configuration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
          <span className="text-muted-foreground">
            Verifying authentication...
          </span>
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
              title: "Pricing & Billing",
              href: "/dashboard/super-admin/billing",
            },
            { title: "Billing Configuration" },
          ]}
        />

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 py-6">
            {/* Header Section */}
            <div className="px-4 lg:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Billing Configuration
                  </h1>
                  <p className="text-muted-foreground">
                    Configure pricing and billing options for digital signature
                    services
                  </p>
                </div>
                <Button
                  onClick={saveConfiguration}
                  disabled={isSubmitting}
                  className="min-w-[140px] bg-green-600 hover:bg-green-700 text-white border-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Configuration
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-4 lg:px-6">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview" className="cursor-pointer">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="pricing" className="cursor-pointer">
                    Pricing
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="cursor-pointer">
                    Billing Cycles
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Revenue Models Overview */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0 shadow-md">
                      <CardHeader className="pb-1">
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                          <CreditCard className="h-5 w-5" />
                          Prepaid Model
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <p className="text-sm text-blue-700">
                          Organizations pay upfront and use services until their
                          balance is exhausted.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-600">
                              Single Signature:
                            </span>
                            <span className="font-medium text-blue-900">
                              {formatCurrency(
                                billingConfig.pricing.singleSignaturePrice
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">
                              Multiple Signature:
                            </span>
                            <span className="font-medium text-blue-900">
                              {formatCurrency(
                                billingConfig.pricing.multipleSignaturePrice
                              )}{" "}
                              per signature
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-50 to-green-100 border-0 shadow-md">
                      <CardHeader className="pb-1">
                        <CardTitle className="flex items-center gap-2 text-green-800">
                          <Calendar className="h-5 w-5" />
                          Postpaid Model
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <p className="text-sm text-green-700">
                          Organizations choose a billing cycle and pay at the
                          end of the period.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="text-green-600 font-medium">
                            Available Billing Cycles:
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {billingConfig.enabledBillingCycles.map((cycle) => (
                              <div key={cycle} className="text-green-700">
                                • {CYCLE_DISPLAY_MAP[cycle]}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Current Configuration Summary */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Current Configuration Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                          <h4 className="font-medium text-lg">
                            Pricing Structure
                          </h4>
                          <div className="space-y-2 text-sm bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between">
                              <span>Single Signature:</span>
                              <span className="font-medium">
                                {formatCurrency(
                                  billingConfig.pricing.singleSignaturePrice
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Multiple Signature:</span>
                              <span className="font-medium">
                                {formatCurrency(
                                  billingConfig.pricing.multipleSignaturePrice
                                )}{" "}
                                per signature
                              </span>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                              <div className="text-xs text-gray-600">
                                Example: 4 signatures ={" "}
                                {formatCurrency(
                                  calculateSignatureCost(
                                    true,
                                    4,
                                    billingConfig.pricing
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-lg">
                            Available Options
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="font-medium mb-2">
                                Revenue Models:
                              </div>
                              <div className="space-y-1">
                                <div>
                                  • Prepaid - Pay upfront, use until exhausted
                                </div>
                                <div>
                                  • Postpaid - Pay at end of billing cycle
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="font-medium mb-2">
                                Postpaid Billing Cycles:
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                {billingConfig.enabledBillingCycles.map(
                                  (cycle) => (
                                    <div key={cycle}>
                                      • {CYCLE_DISPLAY_MAP[cycle]}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pricing Tab */}
                <TabsContent value="pricing" className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Digital Signature Pricing
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Set the pricing for single and multiple signature
                        services (Currency: BTN)
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-6">
                      <div className="grid gap-6 md:grid-cols-2 max-w-2xl">
                        {/* Single Signature Price */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="singlePrice"
                            className="text-sm font-medium"
                          >
                            Single Signature Price (BTN) *
                          </Label>
                          <Input
                            id="singlePrice"
                            type="number"
                            min="0.1"
                            step="0.1"
                            placeholder="5"
                            value={billingConfig.pricing.singleSignaturePrice}
                            onChange={(e) =>
                              handlePricingChange(
                                "singleSignaturePrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className={`text-lg font-medium ${
                              formErrors["pricing.singleSignaturePrice"]
                                ? "border-destructive"
                                : ""
                            }`}
                          />
                          {formErrors["pricing.singleSignaturePrice"] && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {formErrors["pricing.singleSignaturePrice"]}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Price charged when a document requires one signature
                          </p>
                        </div>

                        {/* Multiple Signature Price */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="multiplePrice"
                            className="text-sm font-medium"
                          >
                            Multiple Signature Price (BTN per signature) *
                          </Label>
                          <Input
                            id="multiplePrice"
                            type="number"
                            min="0.1"
                            step="0.1"
                            placeholder="8"
                            value={billingConfig.pricing.multipleSignaturePrice}
                            onChange={(e) =>
                              handlePricingChange(
                                "multipleSignaturePrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className={`text-lg font-medium ${
                              formErrors["pricing.multipleSignaturePrice"]
                                ? "border-destructive"
                                : ""
                            }`}
                          />
                          {formErrors["pricing.multipleSignaturePrice"] && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {formErrors["pricing.multipleSignaturePrice"]}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Price charged per signature when a document requires
                            multiple signatures
                          </p>
                        </div>
                      </div>

                      {/* Pricing Examples */}
                      <div className="bg-blue-50 rounded-lg p-4 max-w-2xl">
                        <h4 className="font-medium mb-3 text-blue-900">
                          Pricing Examples
                        </h4>
                        <div className="grid gap-2 text-sm">
                          <div className="flex justify-between py-1">
                            <span className="text-blue-700">
                              1 Single Signature Document:
                            </span>
                            <span className="font-medium text-blue-900">
                              {formatCurrency(
                                billingConfig.pricing.singleSignaturePrice
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-blue-700">
                              Document with 3 Signatures:
                            </span>
                            <span className="font-medium text-blue-900">
                              {formatCurrency(
                                calculateSignatureCost(
                                  true,
                                  3,
                                  billingConfig.pricing
                                )
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-blue-700">
                              Document with 5 Signatures:
                            </span>
                            <span className="font-medium text-blue-900">
                              {formatCurrency(
                                calculateSignatureCost(
                                  true,
                                  5,
                                  billingConfig.pricing
                                )
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-t border-blue-200 pt-2">
                            <span className="text-blue-700">
                              Document with 10 Signatures:
                            </span>
                            <span className="font-medium text-blue-900">
                              {formatCurrency(
                                calculateSignatureCost(
                                  true,
                                  10,
                                  billingConfig.pricing
                                )
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Billing Cycles Tab */}
                <TabsContent value="billing" className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Postpaid Billing Cycles
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Choose which billing cycles organizations can select for
                        postpaid subscriptions
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-6">
                      <div className="space-y-4">
                        {Object.entries(CYCLE_DISPLAY_MAP).map(
                          ([cycle, label]) => (
                            <div
                              key={cycle}
                              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Checkbox
                                id={cycle}
                                checked={billingConfig.enabledBillingCycles.includes(
                                  cycle as any
                                )}
                                onCheckedChange={(checked) =>
                                  handleBillingCycleToggle(
                                    cycle,
                                    checked as boolean
                                  )
                                }
                                className="text-primary"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={cycle}
                                  className="text-base font-medium cursor-pointer"
                                >
                                  {label}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {cycle === BILLING_CYCLES.MONTHLY &&
                                    "Organizations are billed every month"}
                                  {cycle === BILLING_CYCLES.QUARTERLY &&
                                    "Organizations are billed every 3 months"}
                                  {cycle === BILLING_CYCLES.HALF_YEARLY &&
                                    "Organizations are billed every 6 months"}
                                  {cycle === BILLING_CYCLES.YEARLY &&
                                    "Organizations are billed every 12 months"}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {formErrors["enabledBillingCycles"] && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {formErrors["enabledBillingCycles"]}
                          </AlertDescription>
                        </Alert>
                      )}

                      <Alert className="border-blue-200 bg-blue-50">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          Organizations using the postpaid model will be able to
                          choose from the selected billing cycles. They will be
                          charged at the end of each billing period based on
                          their usage.
                        </AlertDescription>
                      </Alert>
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
