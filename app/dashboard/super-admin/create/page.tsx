// app/dashboard/super-admin/create/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useExternalToken } from "@/hooks/useExternalToken";
import { useToast } from "@/lib/toast-context";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { OrganizationCreationWizard } from "@/components/organization/wizard";
import type { CreateOrganizationData } from "@/lib/schemas/organization";
import type { SubscriptionData } from "@/lib/schemas/subscription";

export default function CreateOrganizationPage() {
  const { user, loading, error, isAuthenticated } = useAuth({
    requiredRole: "SUPER_ADMIN",
  });

  const { showToast } = useToast();
  const router = useRouter();

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        message:
          "Failed to logout properly. Please try again or contact support.",
      });
    }
  };

  // Handle successful organization and subscription creation
  const handleCreationSuccess = async (
    orgData: CreateOrganizationData,
    subscriptionData: SubscriptionData
  ) => {
    setIsSubmitting(true);

    try {
      // console.log("🚀 Submitting organization with subscription:", {
      //   organization: orgData,
      //   subscription: subscriptionData,
      // });

      // Combine data for API call
      const combinedData = {
        ...orgData,
        ...subscriptionData,
      };

      // Call the new API endpoint
      const response = await fetch("/api/organizations-with-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(combinedData),
      });

      const result = await response.json();

      if (result.success) {
        // Complete success
        // console.log("✅ Organization and subscription created:", result.data);

        showToast({
          type: "success",
          title: "Organization Created Successfully",
          message: `${
            orgData.name
          } has been created with ${subscriptionData.subscriptionType.toLowerCase()} subscription.`,
          duration: 4000,
        });

        // Show subscription details in a follow-up toast
        setTimeout(() => {
          if (subscriptionData.subscriptionType === "ENTERPRISE") {
            showToast({
              type: "info",
              title: "Subscription Configured",
              message: `${subscriptionData.signaturePlan} Digital Signature + ${subscriptionData.verificationPlan} Verification plans activated.`,
              duration: 4000,
            });
          } else {
            showToast({
              type: "info",
              title: "Pay-Per-Use Activated",
              message: `3-month contract configured with quarterly billing. Nu. 5 per signature, Nu. 20 per verification.`,
              duration: 4000,
            });
          }
        }, 2000);

        // Redirect to organizations list
        setTimeout(() => {
          router.push("/dashboard/super-admin/organizations");
        }, 3000);
      } else if (response.status === 207 && result.data?.partialSuccess) {
        // Partial success - organization created but subscription failed
        console.warn("⚠️ Partial success:", result);

        showToast({
          type: "warning",
          title: "Organization Created, Subscription Failed",
          message: `${orgData.name} was created (ID: ${result.data.orgId}) but subscription setup failed. Please configure subscription manually.`,
          duration: 6000,
        });

        // Redirect to organizations list where they can see the new org
        setTimeout(() => {
          router.push("/dashboard/super-admin/organizations");
        }, 3000);
      } else {
        // Complete failure
        console.error("❌ Creation failed:", result);

        let errorMessage =
          result.message || "Failed to create organization and subscription.";

        // Add step-specific guidance
        if (result.step === "organization_creation") {
          errorMessage += " The organization could not be created.";
        } else if (result.step === "subscription_creation") {
          errorMessage +=
            " The organization was created but subscription setup failed.";
        }

        showToast({
          type: "error",
          title: "Creation Failed",
          message: errorMessage,
          duration: 6000,
        });
      }
    } catch (error) {
      console.error("💥 Submission error:", error);
      showToast({
        type: "error",
        title: "Connection Error",
        message:
          "Failed to connect to the server. Please check your connection and try again.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle wizard cancellation
  const handleCancel = () => {
    router.push("/dashboard/super-admin/organizations");
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
              title: "Organizations",
              href: "/dashboard/super-admin/organizations",
            },
            { title: "Create Organization" },
          ]}
        />

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 py-6">
            {/* Main Content */}
            <div className="px-4 lg:px-6">
              <OrganizationCreationWizard
                onSuccess={handleCreationSuccess}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
