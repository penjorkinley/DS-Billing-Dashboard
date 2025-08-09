import { z } from "zod";

// Base organization validation fields
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
  status: z.enum(["active", "inactive"], {
    error: "Please select a status",
  }),
  contactEmail: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must not exceed 100 characters")
    .trim(),
  subscription: z.enum(["prepaid", "postpaid"], {
    error: "Please select a subscription type",
  }),
};

// Organization creation schema
export const createOrganizationSchema = z.object({
  ...baseOrganizationFields,
  createdBy: z
    .string()
    .min(2, "Created by field must be at least 2 characters")
    .max(100, "Created by field must not exceed 100 characters")
    .trim(),
});

// Organization edit schema (excludes createdBy, includes all editable fields)
export const editOrganizationSchema = z.object({
  ...baseOrganizationFields,
});

// Organization update schema (for future use - partial updates)
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

// Full organization schema (including auto-generated fields)
export const organizationSchema = createOrganizationSchema.extend({
  id: z.number().int().positive(),
  orgId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  updatedBy: z.string().optional(),
});

// Type exports
export type CreateOrganizationData = z.infer<typeof createOrganizationSchema>;
export type EditOrganizationData = z.infer<typeof editOrganizationSchema>;
export type UpdateOrganizationData = z.infer<typeof updateOrganizationSchema>;
export type OrganizationData = z.infer<typeof organizationSchema>;

// Organization interface for frontend (matches your existing data structure)
export interface Organization {
  id: string;
  name: string;
  shortName: string;
  status: "active" | "inactive";
  revenue: number;
  createdAt: string;
  contactEmail: string;
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

// Utility function to generate webhook ID from organization name
export const generateWebhookIdFromName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 30);
};

// Default form values for creation
export const defaultCreateOrganizationValues: Partial<CreateOrganizationData> =
  {
    name: "",
    webhookId: "",
    webhookUrl: "",
    status: "active",
    contactEmail: "",
    subscription: "prepaid",
    createdBy: "",
  };

// Default form values for editing (will be populated from organization data)
export const defaultEditOrganizationValues: Partial<EditOrganizationData> = {
  name: "",
  webhookId: "",
  webhookUrl: "",
  status: "active",
  contactEmail: "",
  subscription: "prepaid",
};
