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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  Edit,
  Building2,
  CheckCircle,
  X,
} from "lucide-react";
import {
  editOrganizationSchema,
  parseValidationErrors,
  generateWebhookIdFromName,
  type Organization,
  type EditOrganizationData,
  type FormErrors,
} from "@/lib/schemas/organization";

interface EditOrganizationDialogProps {
  organization: Organization;
  onSave: (orgId: string, updatedData: EditOrganizationData) => void;
  children?: React.ReactNode;
}

export function EditOrganizationDialog({
  organization,
  onSave,
  children,
}: EditOrganizationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EditOrganizationData>({
    name: "",
    webhookId: "",
    webhookUrl: "",
    status: "active",
    contactEmail: "",
    subscription: "prepaid",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Initialize form data when dialog opens
  useEffect(() => {
    if (open && organization) {
      setFormData({
        name: organization.name,
        webhookId: generateWebhookIdFromName(organization.name),
        webhookUrl: `https://${organization.shortName.toLowerCase()}.gov.bt/webhook`,
        status: organization.status,
        contactEmail: organization.contactEmail,
        subscription: organization.subscription,
      });
      setFormErrors({});
    }
  }, [open, organization]);

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
  };

  // Generate webhook ID suggestion
  const generateWebhookId = () => {
    if (formData.name) {
      const suggestion = generateWebhookIdFromName(formData.name);
      handleInputChange("webhookId", suggestion);
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
      onSave(organization.id, formData);

      // Close dialog
      setOpen(false);
    } catch (error) {
      console.error("Error updating organization:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white">
        <div className="relative">
          {/* Header Section */}
          <div className="space-y-1 pt-2 pb-6">
            <div className="flex items-center gap-2 pr-8">
              <Building2 className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Edit Organization</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Update the organization details. Changes will be saved
              immediately.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={(e) =>
                  handleInputChange("webhookUrl", e.target.value)
                }
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

            {/* Contact Email */}
            <div className="space-y-2">
              <Label
                htmlFor="edit-contactEmail"
                className="text-sm font-medium"
              >
                Contact Email *
              </Label>
              <Input
                id="edit-contactEmail"
                type="email"
                placeholder="admin@organization.com"
                value={formData.contactEmail}
                onChange={(e) =>
                  handleInputChange("contactEmail", e.target.value)
                }
                className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                  formErrors.contactEmail
                    ? "border-destructive focus:border-destructive"
                    : ""
                }`}
              />
              {formErrors.contactEmail && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.contactEmail}
                </p>
              )}
            </div>

            {/* Status and Subscription in a row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-sm font-medium">
                  Status *
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
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
                    <SelectItem value="active" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive" className="cursor-pointer">
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

              {/* Subscription */}
              <div className="space-y-2">
                <Label
                  htmlFor="edit-subscription"
                  className="text-sm font-medium"
                >
                  Subscription *
                </Label>
                <Select
                  value={formData.subscription}
                  onValueChange={(value) =>
                    handleInputChange("subscription", value)
                  }
                >
                  <SelectTrigger
                    className={`border-gray-200 cursor-pointer focus:border-primary focus:ring-primary/20 ${
                      formErrors.subscription
                        ? "border-destructive focus:border-destructive"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select subscription" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 text-popover-foreground border-gray-200 dark:border-gray-700">
                    <SelectItem value="prepaid" className="cursor-pointer">
                      Prepaid
                    </SelectItem>
                    <SelectItem value="postpaid" className="cursor-pointer">
                      Postpaid
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.subscription && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.subscription}
                  </p>
                )}
              </div>
            </div>

            {/* Info Alert */}
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Organization ID and creation date cannot be modified. Last
                updated timestamp will be automatically set.
              </AlertDescription>
            </Alert>

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
        </div>
      </DialogContent>
    </Dialog>
  );
}
