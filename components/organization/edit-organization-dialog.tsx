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
  Building2,
  CheckCircle,
} from "lucide-react";
import {
  editOrganizationSchema,
  parseValidationErrors,
  generateWebhookIdFromName,
  type OrganizationDisplay,
  type EditOrganizationData,
  type FormErrors,
} from "@/lib/schemas/organization";
import { useOrganizations } from "@/hooks/useOrganizations";

interface EditOrganizationDialogProps {
  organization: OrganizationDisplay;
  onSave: (orgId: string, updatedData: EditOrganizationData) => void;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function EditOrganizationDialog({
  organization,
  onSave,
  onOpenChange,
  children,
}: EditOrganizationDialogProps) {
  // Add the useOrganizations hook
  const { editOrganization, isLoading, error, clearError } = useOrganizations();

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EditOrganizationData>({
    name: "",
    webhookId: "",
    webhookUrl: "",
    status: "active",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Handle dialog state changes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  // Initialize form data when dialog opens
  useEffect(() => {
    if (open && organization) {
      setFormData({
        name: organization.name,
        webhookId: organization.webhookId,
        webhookUrl: organization.webhookUrl,
        status: organization.status,
      });
      setFormErrors({});
      setApiError(null);
      clearError();
    }
  }, [open, organization, clearError]);

  // Handle form field changes
  const handleInputChange = (
    field: keyof EditOrganizationData,
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
      editOrganizationSchema.parse(formData);
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

  // Convert form data to API format
  const convertToApiFormat = (formData: EditOrganizationData) => {
    return {
      name: formData.name,
      webhookId: formData.webhookId,
      webhookUrl: formData.webhookUrl,
      status: formData.status.toUpperCase() as "ACTIVE" | "INACTIVE",
      createdBy: "admin", // You might want to get this from auth context
    };
  };

  // Handle form submission - UPDATED WITH REAL API INTEGRATION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    clearError();

    try {
      // Convert form data to API format
      const apiData = convertToApiFormat(formData);

      // Call the real API to update the organization
      const result = await editOrganization(organization.orgId, apiData);

      if (result.success) {
        // Call the parent's onSave function for local state updates
        onSave(organization.orgId, formData);

        // Close dialog
        handleOpenChange(false);

        console.log("Organization updated successfully:", result.data);
      } else {
        // Handle API errors
        if (result.errors && result.errors.length > 0) {
          // Handle validation errors from API
          const errors: FormErrors = {};
          result.errors.forEach((error) => {
            errors[error.field] = error.message;
          });
          setFormErrors(errors);
        } else {
          // Handle general API error
          setApiError(result.message || "Failed to update organization");
        }
      }
    } catch (error) {
      console.error("Error updating organization:", error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            <Building2 className="h-5 w-5 text-primary" />
            Edit Organization
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update the organization details. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Display API errors */}
          {(apiError || error) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError || error}</AlertDescription>
            </Alert>
          )}

          {/* Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Organization Name *
            </Label>
            <Input
              id="edit-name"
              type="text"
              placeholder="Enter organization name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isSubmitting || isLoading}
              className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                formErrors.name
                  ? "border-destructive focus:border-destructive"
                  : ""
              }`}
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
              <Label htmlFor="edit-webhookId" className="text-sm font-medium">
                Webhook ID *
              </Label>
            </div>
            <Input
              id="edit-webhookId"
              type="text"
              placeholder="webhook_id_example"
              value={formData.webhookId}
              onChange={(e) => handleInputChange("webhookId", e.target.value)}
              disabled={isSubmitting || isLoading}
              className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                formErrors.webhookId
                  ? "border-destructive focus:border-destructive"
                  : ""
              }`}
            />
            <p className="text-xs text-muted-foreground">
              Only letters, numbers, hyphens, and underscores allowed
            </p>
            {formErrors.webhookId && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {formErrors.webhookId}
              </p>
            )}
          </div>

          {/* Webhook URL */}
          <div className="space-y-2">
            <Label htmlFor="edit-webhookUrl" className="text-sm font-medium">
              Webhook URL *
            </Label>
            <Input
              id="edit-webhookUrl"
              type="url"
              placeholder="https://example.com/webhook"
              value={formData.webhookUrl}
              onChange={(e) => handleInputChange("webhookUrl", e.target.value)}
              disabled={isSubmitting || isLoading}
              className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                formErrors.webhookUrl
                  ? "border-destructive focus:border-destructive"
                  : ""
              }`}
            />
            {formErrors.webhookUrl && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {formErrors.webhookUrl}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="edit-status" className="text-sm font-medium">
              Status *
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
              disabled={isSubmitting || isLoading}
            >
              <SelectTrigger
                className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                  formErrors.status
                    ? "border-destructive focus:border-destructive"
                    : ""
                }`}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900 text-popover-foreground border-gray-200 dark:border-gray-700">
                <SelectItem value="active" className="cursor-pointer">
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="cursor-pointer">
                  Inactive
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

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting || isLoading}
              className="border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="min-w-[140px] bg-green-600 hover:bg-green-700 text-white border-0"
            >
              {isSubmitting || isLoading ? (
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
