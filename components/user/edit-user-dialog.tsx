"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  Edit,
  Users,
  CheckCircle,
  Shield,
  Building2,
  Mail,
} from "lucide-react";
import {
  editUserSchema,
  parseValidationErrors,
  type User,
  type EditUserData,
  type FormErrors,
  ROLES,
  ROLE_DISPLAY_MAP,
} from "@/lib/schemas/user";

interface EditUserDialogProps {
  user: User;
  onSave: (userId: number, updatedData: EditUserData) => void;
  children?: React.ReactNode;
}

export function EditUserDialog({
  user,
  onSave,
  children,
}: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EditUserData>({
    userid: "",
    email: "",
    role: ROLES.ORGANIZATION_ADMIN,
    orgId: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Initialize form data when dialog opens
  useEffect(() => {
    if (open && user) {
      setFormData({
        userid: user.userid,
        email: user.email,
        role: user.role,
        orgId: user.orgId || "",
      });
      setFormErrors({});
    }
  }, [open, user]);

  // Handle form field changes
  const handleInputChange = (
    field: keyof EditUserData,
    value: string | null
  ) => {
    // Handle role changes - clear orgId if switching to Super Admin
    if (field === "role") {
      const roleValue = value as EditUserData["role"];
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
      editUserSchema.parse(formData);
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

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Call the parent's onSave function
      onSave(user.id, formData);

      // Close dialog
      setOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current role display name
  const getCurrentRoleDisplay = () => {
    return ROLE_DISPLAY_MAP[formData.role] || formData.role;
  };

  // Check if org field should be shown
  const shouldShowOrgField = formData.role === ROLES.ORGANIZATION_ADMIN;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Users className="h-5 w-5 text-primary" />
            Edit User Account
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update user account details and permissions. Changes will be saved
            immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* User ID */}
          <div className="space-y-2">
            <Label htmlFor="edit-userid" className="text-sm font-medium">
              User ID *
            </Label>
            <Input
              id="edit-userid"
              type="text"
              placeholder="Enter user ID"
              value={formData.userid}
              onChange={(e) => handleInputChange("userid", e.target.value)}
              className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                formErrors.userid
                  ? "border-destructive focus:border-destructive"
                  : ""
              }`}
            />
            <p className="text-xs text-muted-foreground">
              Only letters, numbers, hyphens, and underscores allowed
            </p>
            {formErrors.userid && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {formErrors.userid}
              </p>
            )}
          </div>

          {/* Email Field - NEW */}
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-sm font-medium">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="edit-email"
                type="email"
                placeholder="user@organization.bt"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 ${
                  formErrors.email
                    ? "border-destructive focus:border-destructive"
                    : ""
                }`}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email address for notifications and account recovery
            </p>
            {formErrors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {formErrors.email}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="edit-role" className="text-sm font-medium">
              Role *
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
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
                    <span className="font-medium">Super Administrator</span>
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
              <Label htmlFor="edit-orgId" className="text-sm font-medium">
                Organization ID *
              </Label>
              <Input
                id="edit-orgId"
                type="text"
                placeholder="Enter organization ID (e.g., ORG001)"
                value={formData.orgId || ""}
                onChange={(e) => handleInputChange("orgId", e.target.value)}
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

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
