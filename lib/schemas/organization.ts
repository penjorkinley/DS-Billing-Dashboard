// lib/schemas/organization.ts
import { z } from "zod";

// Base organization validation fields (shared between create and edit)
const baseOrganizationFields = {
  name: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must not exceed 100 characters")
    .trim(),
  webhookId: z
    .string()
    .min(3, "Webhook ID must be at least 3 characters")
    .max(50, "Webhook ID must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Webhook ID can only contain letters, numbers, hyphens, and underscores"
    )
    .trim(),
  webhookUrl: z
    .string()
    .url("Please enter a valid URL")
    .min(10, "URL must be at least 10 characters")
    .max(500, "URL must not exceed 500 characters")
    .trim(),
  status: z.enum(["ACTIVE", "INACTIVE", "active", "inactive"], {
    error: "Please select a valid status",
  }),
};

// Schema for creating organization (API integration)
export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required")
    .max(100, "Name must be less than 100 characters"),
  webhookId: z
    .string()
    .min(1, "Webhook ID is required")
    .max(50, "Webhook ID must be less than 50 characters"),
  webhookUrl: z.string().url("Must be a valid URL"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  createdBy: z.string().min(1, "Created by is required"),
});

// Schema for updating organization (API integration) - uses same validation as create
export const updateOrganizationApiSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required")
    .max(100, "Name must be less than 100 characters"),
  webhookId: z
    .string()
    .min(1, "Webhook ID is required")
    .max(50, "Webhook ID must be less than 50 characters"),
  webhookUrl: z.string().url("Must be a valid URL"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  createdBy: z.string().min(1, "Updated by is required"), // You might want to rename this field
});

// Schema for editing organization (for forms - removed email and subscription)
export const editOrganizationSchema = z.object({
  ...baseOrganizationFields,
  status: z.enum(["active", "inactive"], {
    error: "Please select a status",
  }),
});

// Organization update schema (for partial updates - future use)
export const updateOrganizationSchema = editOrganizationSchema
  .partial()
  .extend({
    updatedBy: z
      .string()
      .min(2, "Updated by field must be at least 2 characters")
      .max(100, "Updated by field must not exceed 100 characters")
      .trim()
      .optional(),
  });

// Full organization schema (API response structure)
export const organizationSchema = z.object({
  id: z.number().int().positive(),
  orgId: z.string(),
  name: z.string(),
  webhookId: z.string(),
  webhookUrl: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  createdBy: z.string(),
  updatedBy: z.string().nullable(),
});

// Type exports for API integration
export type CreateOrganizationData = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationApiData = z.infer<
  typeof updateOrganizationApiSchema
>;
export type EditOrganizationData = z.infer<typeof editOrganizationSchema>;
export type UpdateOrganizationData = z.infer<typeof updateOrganizationSchema>;
export type OrganizationApiData = z.infer<typeof organizationSchema>;

// Organization interface for display components (with dummy data)
export interface OrganizationDisplay {
  id: string;
  orgId: string;
  name: string;
  webhookId: string;
  webhookUrl: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  // Dummy fields for display
  monthlyRevenue: number;
  subscription: "prepaid" | "postpaid";
}

// Form errors type
export interface FormErrors {
  [key: string]: string;
}

// Utility function to parse validation errors
export const parseValidationErrors = (error: z.ZodError): FormErrors => {
  const errors: FormErrors = {};
  error.issues.forEach((err) => {
    if (err.path[0]) {
      errors[err.path[0] as string] = err.message;
    }
  });
  return errors;
};

// Helper function to generate webhook ID from organization name
export const generateWebhookIdFromName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 30);
};

// Convert API data to display format with dummy subscription data
export const convertToDisplayFormat = (
  apiData: OrganizationApiData
): OrganizationDisplay => {
  // Generate dummy data based on org ID for consistency
  const orgHash = apiData.orgId.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const monthlyRevenue = Math.abs(orgHash % 50000) + 15000; // Range: 15k-65k
  const subscription = Math.abs(orgHash) % 2 === 0 ? "prepaid" : "postpaid";

  return {
    id: apiData.orgId, // Use orgId as display ID
    orgId: apiData.orgId,
    name: apiData.name,
    webhookId: apiData.webhookId,
    webhookUrl: apiData.webhookUrl,
    status: apiData.status.toLowerCase() as "active" | "inactive",
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
    createdBy: apiData.createdBy,
    updatedBy: apiData.updatedBy,
    monthlyRevenue,
    subscription,
  };
};

// Convert form data to API format for updates
export const convertFormToApiFormat = (
  formData: EditOrganizationData,
  updatedBy: string
): UpdateOrganizationApiData => {
  return {
    name: formData.name,
    webhookId: formData.webhookId,
    webhookUrl: formData.webhookUrl,
    status: formData.status.toUpperCase() as "ACTIVE" | "INACTIVE",
    createdBy: updatedBy, // This might need to be renamed in your API
  };
};

// Default values for API integration (create organization)
export const defaultCreateOrganizationValues: Partial<CreateOrganizationData> =
  {
    name: "",
    webhookId: "",
    webhookUrl: "",
    status: "ACTIVE",
    createdBy: "",
  };

// Default form values for editing (existing components)
export const defaultEditOrganizationValues: Partial<EditOrganizationData> = {
  name: "",
  webhookId: "",
  webhookUrl: "",
  status: "active",
};

// Status options for API integration
export const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
] as const;

// Status options for existing components
export const EDIT_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;
