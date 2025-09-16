// components/organization/wizard/organization-details-form.tsx
"use client";

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
import { Building2, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import type {
  CreateOrganizationData,
  FormErrors,
} from "@/lib/schemas/organization";

interface OrganizationDetailsFormProps {
  formData: CreateOrganizationData;
  formErrors: FormErrors;
  isValidating: boolean;
  onInputChange: (field: keyof CreateOrganizationData, value: string) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function OrganizationDetailsForm({
  formData,
  formErrors,
  isValidating,
  onInputChange,
  onNext,
  onCancel,
}: OrganizationDetailsFormProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-1 pt-5 pr-10 pl-12 pb-0">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Organization Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-12 pb-8 pt-8">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onNext();
          }}
        >
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
              onChange={(e) => onInputChange("name", e.target.value)}
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
            <Label htmlFor="webhookId" className="text-sm font-medium">
              Webhook ID *
            </Label>
            <Input
              id="webhookId"
              type="text"
              placeholder="webhook_id_example"
              value={formData.webhookId}
              onChange={(e) => onInputChange("webhookId", e.target.value)}
              className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                formErrors.webhookId
                  ? "border-destructive focus:border-destructive"
                  : ""
              }`}
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
            <Label htmlFor="webhookUrl" className="text-sm font-medium">
              Webhook URL *
            </Label>
            <Input
              id="webhookUrl"
              type="url"
              placeholder="https://example.com/webhook"
              value={formData.webhookUrl}
              onChange={(e) => onInputChange("webhookUrl", e.target.value)}
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
            <Label htmlFor="status" className="text-sm font-medium">
              Status *
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => onInputChange("status", value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-primary focus:ring-primary/20">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
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
            <Label htmlFor="createdBy" className="text-sm font-medium">
              Created By *
            </Label>
            <Input
              id="createdBy"
              type="text"
              placeholder="Enter creator name"
              value={formData.createdBy}
              onChange={(e) => onInputChange("createdBy", e.target.value)}
              className={`border-gray-200 focus:border-primary focus:ring-primary/20 ${
                formErrors.createdBy
                  ? "border-destructive focus:border-destructive"
                  : ""
              }`}
            />
            {formErrors.createdBy && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {formErrors.createdBy}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isValidating}
              className="border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isValidating}
              className="min-w-[160px] bg-green-600 hover:bg-green-700 text-white"
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  Choose Subscription
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
