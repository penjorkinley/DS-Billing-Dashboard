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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  UserPlus,
  Loader2,
  AlertCircle,
  CheckCircle,
  Shield,
  Building2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  createUserSchema,
  parseValidationErrors,
  defaultCreateUserValues,
  type CreateUserData,
  type FormErrors,
  ROLES,
} from "@/lib/schemas/user";

export default function CreateUserPage() {
  const { user, loading, error, isAuthenticated } = useAuth({
    requiredRole: "SUPER_ADMIN",
  });
  const { showToast } = useToast();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<CreateUserData>({
    ...defaultCreateUserValues,
  } as CreateUserData);

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    field: keyof CreateUserData,
    value: string | null
  ) => {
    // Handle role changes - clear orgId if switching to Super Admin
    if (field === "role") {
      const roleValue = value as CreateUserData["role"];
      if (roleValue === ROLES.SUPER_ADMIN) {
        setFormData((prev) => ({
          ...prev,
          role: roleValue,
          orgId: null,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          role: roleValue,
          orgId: prev.orgId || "",
        }));
      }
    } else if (field === "orgId") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value as string }));
    }

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    try {
      createUserSchema.parse(formData);
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast({
        type: "error",
        title: "Validation Error",
        message: "Please fix the errors in the form before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        userid: formData.userid,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        orgId: formData.role === ROLES.SUPER_ADMIN ? null : formData.orgId,
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        showToast({
          type: "success",
          title: "User Created",
          message: `User ${formData.userid} has been successfully created.`,
          duration: 3000,
        });

        // Redirect to users list
        setTimeout(() => {
          router.push("/dashboard/super-admin/users");
        }, 1500);
      } else {
        showToast({
          type: "error",
          title: "Creation Failed",
          message: result.message || "Failed to create user.",
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      showToast({
        type: "error",
        title: "Connection Error",
        message: "Failed to connect to the server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if org field should be shown
  const shouldShowOrgField = formData.role === ROLES.ORGANIZATION_ADMIN;

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
              title: "User Management",
              href: "/dashboard/super-admin/users",
            },
            { title: "Create User" },
          ]}
        />

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 py-6">
            {/* Header Section */}
            <div className="px-4 lg:px-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Create New User
                </h1>
                <p className="text-muted-foreground">
                  Add a new user account to your system
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="px-4 lg:px-6">
              <div className="max-w-3xl mx-auto">
                <Card className="shadow-lg border-0">
                  <CardHeader className="space-y-1 pt-6 px-8 pb-0">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">
                        User Account Details
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter the required information to create a new user
                      account
                    </p>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* User ID */}
                      <div className="space-y-2">
                        <Label htmlFor="userid" className="text-sm font-medium">
                          User ID *
                        </Label>
                        <Input
                          id="userid"
                          type="text"
                          placeholder="Enter user ID"
                          value={formData.userid}
                          onChange={(e) =>
                            handleInputChange("userid", e.target.value)
                          }
                          className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                            formErrors.userid
                              ? "border-destructive focus:border-destructive"
                              : ""
                          }`}
                        />
                        <p className="text-xs text-muted-foreground">
                          Only letters, numbers, hyphens, and underscores
                          allowed
                        </p>
                        {formErrors.userid && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.userid}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          Password *
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            className={`border-gray-200 focus:border-primary focus:ring-primary/20 pr-10 ${
                              formErrors.password
                                ? "border-destructive focus:border-destructive"
                                : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Must be at least 8 characters long
                        </p>
                        {formErrors.password && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.password}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium"
                        >
                          Confirm Password *
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              handleInputChange(
                                "confirmPassword",
                                e.target.value
                              )
                            }
                            className={`border-gray-200 focus:border-primary focus:ring-primary/20 pr-10 ${
                              formErrors.confirmPassword
                                ? "border-destructive focus:border-destructive"
                                : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {formErrors.confirmPassword && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.confirmPassword}
                          </p>
                        )}
                      </div>

                      {/* Role */}
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium">
                          Role *
                        </Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value) =>
                            handleInputChange("role", value)
                          }
                        >
                          <SelectTrigger
                            className={`border-gray-200 cursor-pointer focus:border-primary focus:ring-primary/20 ${
                              formErrors.role
                                ? "border-destructive focus:border-destructive"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-900 text-popover-foreground border-gray-200 dark:border-gray-700">
                            <SelectItem
                              value={ROLES.SUPER_ADMIN}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-purple-600" />
                                <span className="font-medium">
                                  Super Administrator
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem
                              value={ROLES.ORGANIZATION_ADMIN}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">
                                  Organization Administrator
                                </span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.role && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.role}
                          </p>
                        )}
                      </div>

                      {/* Organization ID - Only show for Organization Admins */}
                      {shouldShowOrgField && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="orgId"
                            className="text-sm font-medium"
                          >
                            Organization ID *
                          </Label>
                          <Input
                            id="orgId"
                            type="text"
                            placeholder="Enter organization ID (e.g., ORG001)"
                            value={formData.orgId || ""}
                            onChange={(e) =>
                              handleInputChange("orgId", e.target.value)
                            }
                            className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                              formErrors.orgId
                                ? "border-destructive focus:border-destructive"
                                : ""
                            }`}
                          />
                          {formErrors.orgId && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {formErrors.orgId}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Info Alert */}
                      <Alert className="border-blue-200 bg-blue-50">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          User ID must be unique. Creation date and time will be
                          set to current timestamp. Password will be securely
                          hashed before storage.
                        </AlertDescription>
                      </Alert>

                      {/* Submit Buttons */}
                      <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            router.push("/dashboard/super-admin/users")
                          }
                          disabled={isSubmitting}
                          className="border-gray-200 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="min-w-[140px] bg-green-600 hover:bg-green-700 text-white border-0"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create User"
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
