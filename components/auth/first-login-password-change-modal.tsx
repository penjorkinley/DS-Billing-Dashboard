// components/auth/first-login-password-change-modal.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  Lock,
} from "lucide-react";
import {
  firstLoginPasswordChangeSchema,
  parseValidationErrors,
  type FirstLoginPasswordChangeData,
  type FormErrors,
} from "@/lib/schemas/user";

interface FirstLoginPasswordChangeModalProps {
  isOpen: boolean;
  userEmail: string;
  onPasswordChanged: () => void;
  // Modal cannot be closed until password is changed - no onOpenChange prop
}

export function FirstLoginPasswordChangeModal({
  isOpen,
  userEmail,
  onPasswordChanged,
}: FirstLoginPasswordChangeModalProps) {
  const [formData, setFormData] = useState<FirstLoginPasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleInputChange = (
    field: keyof FirstLoginPasswordChangeData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    try {
      firstLoginPasswordChangeSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        const zodError = error as any;
        const errors = parseValidationErrors(zodError);
        setFormErrors(errors);
      }
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch("/api/auth/change-password-first-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Success! Notify parent component
        onPasswordChanged();
      } else {
        // Handle validation errors or API errors
        if (result.errors) {
          const errors: FormErrors = {};
          result.errors.forEach((error: any) => {
            errors[error.field] = error.message;
          });
          setFormErrors(errors);
        } else {
          setApiError(result.message || "Password change failed");
        }
      }
    } catch (error) {
      console.error("Password change error:", error);
      setApiError("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength indicator (simple version)
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "", color: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { strength: 0, text: "Very Weak", color: "text-red-600" },
      { strength: 1, text: "Weak", color: "text-red-500" },
      { strength: 2, text: "Fair", color: "text-yellow-500" },
      { strength: 3, text: "Good", color: "text-blue-500" },
      { strength: 4, text: "Strong", color: "text-green-500" },
      { strength: 5, text: "Very Strong", color: "text-green-600" },
    ];

    return levels[score];
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Welcome to Bhutan NDI Digital Signature Platform
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                For security, please change your temporary password
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* User Info */}
          <div className="p-4 bg-blue-50 rounded-lg border">
            <p className="text-sm text-blue-800">
              <strong>Account:</strong> {userEmail}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              After changing your password, you'll be guided through
              subscription setup.
            </p>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm font-medium">
                Current Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter your temporary password"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleInputChange("currentPassword", e.target.value)
                  }
                  className={`pr-10 ${
                    formErrors.currentPassword ? "border-destructive" : ""
                  }`}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isSubmitting}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {formErrors.currentPassword && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium">
                New Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                  className={`pr-10 ${
                    formErrors.newPassword ? "border-destructive" : ""
                  }`}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isSubmitting}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <p className={`text-xs ${passwordStrength.color}`}>
                  Password strength: {passwordStrength.text}
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                At least 8 characters with uppercase, lowercase, numbers, and
                symbols
              </p>
              {formErrors.newPassword && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm New Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`pr-10 ${
                    formErrors.confirmPassword ? "border-destructive" : ""
                  }`}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Change Password & Continue
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Security Note */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-gray-600 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-700">
                  Security Notice
                </p>
                <p className="text-xs text-gray-600">
                  This step is mandatory for all new Organization Administrator
                  accounts. You cannot access the dashboard until you complete
                  this setup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
