"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/lib/toast-context";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BillingHeader from "@/components/billing/billing-header";
import OverviewCards from "@/components/billing/overview-cards";
import ConfigurationSummary from "@/components/billing/configuration-summary";
import PricingForm from "@/components/billing/pricing-form";
import BillingCycles from "@/components/billing/billing-cycles";

import {
  billingConfigSchema,
  parseBillingValidationErrors,
  defaultBillingConfig,
  type PricingConfig,
  type BillingConfig,
  type BillingFormErrors,
} from "@/lib/schemas/billing";

export default function BillingConfigurationPage() {
  const { user, loading, error, isAuthenticated } = useAuth({
    requiredRole: "SUPER_ADMIN",
  });
  const { showToast } = useToast();

  const [billingConfig, setBillingConfig] = useState<BillingConfig>({
    ...defaultBillingConfig,
    updatedBy: user?.userid || "",
  });
  const [formErrors, setFormErrors] = useState<BillingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure updatedBy when auth is ready
  useEffect(() => {
    if (user?.userid && !billingConfig.updatedBy) {
      setBillingConfig((prev) => ({ ...prev, updatedBy: user.userid }));
    }
  }, [user?.userid, billingConfig.updatedBy]);

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
      } else {
        showToast({
          type: "error",
          title: "Logout Error",
          message: "Failed to logout properly. Redirecting anyway...",
        });
        setTimeout(() => (window.location.href = "/login"), 2000);
      }
    } catch (e) {
      console.error("Logout error:", e);
      showToast({
        type: "error",
        title: "Connection Error",
        message: "Failed to logout properly. Redirecting anyway...",
      });
      setTimeout(() => (window.location.href = "/login"), 2000);
    }
  };

  // ---- Handlers passed to children ----
  const handlePricingChange = (field: keyof PricingConfig, value: number) => {
    setBillingConfig((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, [field]: value },
    }));
    if (formErrors[`pricing.${field}`]) {
      setFormErrors((prev) => ({ ...prev, [`pricing.${field}`]: "" }));
    }
  };

  const handleBillingCycleToggle = (cycle: string, checked: boolean) => {
    setBillingConfig((prev) => ({
      ...prev,
      enabledBillingCycles: checked
        ? [...prev.enabledBillingCycles, cycle as any]
        : prev.enabledBillingCycles.filter((c) => c !== cycle),
    }));
    if (formErrors["enabledBillingCycles"]) {
      setFormErrors((prev) => ({ ...prev, enabledBillingCycles: "" }));
    }
  };

  const validateConfiguration = (): boolean => {
    try {
      billingConfigSchema.parse(billingConfig);
      setFormErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = parseBillingValidationErrors(err);
        setFormErrors(errors);
      }
      return false;
    }
  };

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

      // TODO: replace with real API call
      console.log("Saving billing configuration:", payload);
      await new Promise((r) => setTimeout(r, 2000));

      showToast({
        type: "success",
        title: "Configuration Saved",
        message: "Billing configuration has been successfully updated.",
        duration: 3000,
      });
    } catch (e) {
      console.error("Error saving configuration:", e);
      showToast({
        type: "error",
        title: "Save Failed",
        message: "Failed to save billing configuration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Auth gates ----
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          {/* keep Loader2 to avoid adding another component here */}
          <svg
            className="h-6 w-6 animate-spin text-brand-primary"
            viewBox="0 0 24 24"
          />
          <span className="text-muted-foreground">
            Verifying authentication...
          </span>
        </div>
      </div>
    );
  }

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

  // ---- Layout ----
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
            <div className="px-4 lg:px-6">
              <BillingHeader
                isSubmitting={isSubmitting}
                onSave={saveConfiguration}
              />
            </div>

            <div className="px-4 lg:px-6">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="overview"
                    className="gap-2 cursor-pointer py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 hover:bg-muted/50 rounded-md"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="pricing"
                    className="gap-2 cursor-pointer py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 hover:bg-muted/50 rounded-md"
                  >
                    Pricing
                  </TabsTrigger>
                  <TabsTrigger
                    value="billing"
                    className="gap-2 cursor-pointer py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 hover:bg-muted/50 rounded-md"
                  >
                    Billing Cycles
                  </TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="space-y-6">
                  <OverviewCards
                    pricing={billingConfig.pricing}
                    enabledBillingCycles={billingConfig.enabledBillingCycles}
                  />
                  <ConfigurationSummary
                    pricing={billingConfig.pricing}
                    enabledBillingCycles={billingConfig.enabledBillingCycles}
                  />
                </TabsContent>

                {/* Pricing */}
                <TabsContent value="pricing" className="space-y-6">
                  <PricingForm
                    pricing={billingConfig.pricing}
                    errors={formErrors}
                    onChange={handlePricingChange}
                  />
                </TabsContent>

                {/* Billing Cycles */}
                <TabsContent value="billing" className="space-y-6">
                  <BillingCycles
                    enabledBillingCycles={billingConfig.enabledBillingCycles}
                    errors={formErrors}
                    onToggle={handleBillingCycleToggle}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
