"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useExternalToken } from "@/hooks/useExternalToken";
import { useToast } from "@/lib/toast-context";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  createOrganizationSchema,
  parseValidationErrors,
  defaultCreateOrganizationValues,
  type CreateOrganizationData,
  type FormErrors,
} from "@/lib/schemas/organization";

export default function CreateOrganizationPage() {
  const { user, loading, error, isAuthenticated } = useAuth({
    requiredRole: "SUPER_ADMIN",
  });

  // API integration hooks
  const {
    createOrganization,
    isLoading: isSubmitting,
    error: apiError,
    clearError,
  } = useOrganizations();
  const {
    generateToken,
    tokenStatus,
    isLoading: tokenLoading,
  } = useExternalToken();

  const { showToast } = useToast();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<CreateOrganizationData>({
    ...defaultCreateOrganizationValues,
  } as CreateOrganizationData);

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  //  Clear API errors when form data changes
  useEffect(() => {
    if (apiError) {
      clearError();
    }
  }, [formData, apiError, clearError]);

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

  // Handle form field changes
  const handleInputChange = (
    field: keyof CreateOrganizationData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    try {
      createOrganizationSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = parseValidationErrors(error);
        setFormErrors(errors);
      }
      return false;
    }
  };

  // Handle form submission with API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Silently check and configure external token if needed
    if (!tokenStatus?.hasValidToken) {
      const tokenResult = await generateToken();
      if (!tokenResult.success) {
        showToast({
          type: "error",
          title: "Service Error",
          message:
            "Unable to process request. Please try again or contact support.",
        });
        return;
      }
    }

    if (!validateForm()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Please fix the errors in the form before submitting.",
      });
      return;
    }

    // API call
    const result = await createOrganization(formData);

    if (!result.success) {
      // Handle validation errors from backend
      if (result.errors) {
        const backendErrors: FormErrors = {};
        result.errors.forEach((error: any) => {
          backendErrors[error.field as keyof CreateOrganizationData] =
            error.message;
        });
        setFormErrors(backendErrors);
      }

      showToast({
        type: "error",
        title: "Creation Failed",
        message: result.message,
      });
      return;
    }

    // Success case - keep your original success handling
    showToast({
      type: "success",
      title: "Organization Created",
      message: `${formData.name} has been successfully created.`,
      duration: 3000,
    });

    // Reset form or redirect
    setTimeout(() => {
      router.push("/dashboard/super-admin/organizations");
    }, 1500);
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
            {/* Header Section */}
            <div className="px-4 lg:px-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Create New Organization
                </h1>
                <p className="text-muted-foreground">
                  Add a new organization to your system
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="px-4 lg:px-6">
              <div className="max-w-3xl mx-auto">
                <Card className="shadow-lg border-0">
                  <CardHeader className="space-y-1 pt-5 pr-10 pl-12 pb-0">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">
                        Organization Details
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter the required information to create a new
                      organization
                    </p>
                  </CardHeader>
                  <CardContent className="px-12 pb-2 pt-2">
                    {/* Display only critical API errors (not token status) */}
                    {apiError && (
                      <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          {apiError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Organization Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Organization Name *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter organization name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                            formErrors.name
                              ? "border-destructive focus:border-destructive"
                              : ""
                          }`}
                          disabled={isSubmitting}
                        />
                        {formErrors.name && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.name}
                          </p>
                        )}
                      </div>

                      {/* Webhook ID */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="webhookId"
                            className="text-sm font-medium"
                          >
                            Webhook ID *
                          </Label>
                        </div>
                        <Input
                          id="webhookId"
                          type="text"
                          placeholder="webhook_id_example"
                          value={formData.webhookId}
                          onChange={(e) =>
                            handleInputChange("webhookId", e.target.value)
                          }
                          className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                            formErrors.webhookId
                              ? "border-destructive focus:border-destructive"
                              : ""
                          }`}
                          disabled={isSubmitting}
                        />

                        {formErrors.webhookId && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.webhookId}
                          </p>
                        )}
                      </div>

                      {/* Webhook URL */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="webhookUrl"
                          className="text-sm font-medium"
                        >
                          Webhook URL *
                        </Label>
                        <Input
                          id="webhookUrl"
                          type="url"
                          placeholder="https://example.com/webhook"
                          value={formData.webhookUrl}
                          onChange={(e) =>
                            handleInputChange("webhookUrl", e.target.value)
                          }
                          className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                            formErrors.webhookUrl
                              ? "border-destructive focus:border-destructive"
                              : ""
                          }`}
                          disabled={isSubmitting}
                        />
                        {formErrors.webhookUrl && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.webhookUrl}
                          </p>
                        )}
                      </div>

                      {/* Status field with updated values */}
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-medium">
                          Status *
                        </Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            handleInputChange("status", value)
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger
                            className={`border-gray-200 cursor-pointer focus:border-primary focus:ring-primary/20 ${
                              formErrors.status
                                ? "border-destructive focus:border-destructive"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-900 text-popover-foreground border-gray-200 dark:border-gray-700">
                            <SelectItem
                              value="ACTIVE"
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                Active
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="INACTIVE"
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                                Inactive
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.status && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.status}
                          </p>
                        )}
                      </div>

                      {/* Created By */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="createdBy"
                          className="text-sm font-medium"
                        >
                          Created By *
                        </Label>
                        <Input
                          id="createdBy"
                          type="text"
                          placeholder="Enter creator name"
                          value={formData.createdBy}
                          onChange={(e) =>
                            handleInputChange("createdBy", e.target.value)
                          }
                          className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                            formErrors.createdBy
                              ? "border-destructive focus:border-destructive"
                              : ""
                          }`}
                          disabled={isSubmitting}
                        />
                        {formErrors.createdBy && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.createdBy}
                          </p>
                        )}
                      </div>

                      {/* Submit Buttons with token loading states */}
                      <div className="flex justify-end gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            router.push("/dashboard/super-admin/organizations")
                          }
                          disabled={isSubmitting || tokenLoading}
                          className="border-gray-200 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting || tokenLoading}
                          className="min-w-[140px] bg-green-600 hover:bg-green-700 text-white border-0"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Organization"
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
