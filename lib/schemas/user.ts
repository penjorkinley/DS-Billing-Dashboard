import { z } from "zod";

// Define the role enum to match the database enum
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ORGANIZATION_ADMIN: "ORGANIZATION_ADMIN",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// Role display mapping for UI
export const ROLE_DISPLAY_MAP = {
  [ROLES.SUPER_ADMIN]: "Super Administrator",
  [ROLES.ORGANIZATION_ADMIN]: "Organization Administrator",
} as const;

// Reverse mapping for saving
export const DISPLAY_TO_ROLE_MAP = {
  "Super Administrator": ROLES.SUPER_ADMIN,
  "Organization Administrator": ROLES.ORGANIZATION_ADMIN,
} as const;

// Base user validation fields
const baseUserFields = {
  userid: z
    .string()
    .min(3, "User ID must be at least 3 characters")
    .max(50, "User ID must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "User ID can only contain letters, numbers, hyphens, and underscores"
    )
    .trim(),
  role: z.enum([ROLES.SUPER_ADMIN, ROLES.ORGANIZATION_ADMIN], {
    error: "Please select a valid role",
  }),
  orgId: z
    .string()
    .min(1, "Organization ID is required for Organization Admins")
    .max(50, "Organization ID must not exceed 50 characters")
    .trim()
    .nullable(),
};

// User creation schema
export const createUserSchema = z
  .object({
    ...baseUserFields,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      // Super Admins should not have an orgId
      if (data.role === ROLES.SUPER_ADMIN) {
        return data.orgId === null || data.orgId === "";
      }
      // Organization Admins must have an orgId
      if (data.role === ROLES.ORGANIZATION_ADMIN) {
        return data.orgId !== null && data.orgId !== "";
      }
      return true;
    },
    {
      message:
        "Organization ID is required for Organization Admins and should be empty for Super Admins",
      path: ["orgId"],
    }
  );

// User edit schema (excludes password fields)
export const editUserSchema = z
  .object({
    ...baseUserFields,
  })
  .refine(
    (data) => {
      // Super Admins should not have an orgId
      if (data.role === ROLES.SUPER_ADMIN) {
        return data.orgId === null || data.orgId === "";
      }
      // Organization Admins must have an orgId
      if (data.role === ROLES.ORGANIZATION_ADMIN) {
        return data.orgId !== null && data.orgId !== "";
      }
      return true;
    },
    {
      message:
        "Organization ID is required for Organization Admins and should be empty for Super Admins",
      path: ["orgId"],
    }
  );

// Password change schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Full user schema (including auto-generated fields)
export const userSchema = editUserSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type exports
export type CreateUserData = z.infer<typeof createUserSchema>;
export type EditUserData = z.infer<typeof editUserSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type UserData = z.infer<typeof userSchema>;

// User interface for frontend display
export interface User {
  id: number;
  userid: string;
  role: UserRole;
  orgId: string | null;
  createdAt: string;
  updatedAt: string;
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

// Utility function to get organization display name
export const getOrgDisplayName = (orgId: string | null): string => {
  if (!orgId) return "N/A";

  const orgMap: Record<string, string> = {
    ORG001: "Ministry of IT",
    ORG002: "Department of Revenue",
    ORG003: "Digital Bhutan",
    ORG004: "Health Ministry",
    ORG005: "Education Department",
    ORG006: "Royal Insurance Corporation",
    ORG007: "Bhutan Power Corporation",
    ORG008: "National Statistics Bureau",
  };

  return orgMap[orgId] || orgId;
};

// Available organizations for dropdowns
export const AVAILABLE_ORGANIZATIONS = [
  { id: "ORG001", name: "Ministry of IT" },
  { id: "ORG002", name: "Department of Revenue" },
  { id: "ORG003", name: "Digital Bhutan" },
  { id: "ORG004", name: "Health Ministry" },
  { id: "ORG005", name: "Education Department" },
  { id: "ORG006", name: "Royal Insurance Corporation" },
  { id: "ORG007", name: "Bhutan Power Corporation" },
  { id: "ORG008", name: "National Statistics Bureau" },
];

// Default form values
export const defaultCreateUserValues: Partial<CreateUserData> = {
  userid: "",
  role: ROLES.ORGANIZATION_ADMIN,
  orgId: "",
  password: "",
  confirmPassword: "",
};

export const defaultEditUserValues: Partial<EditUserData> = {
  userid: "",
  role: ROLES.ORGANIZATION_ADMIN,
  orgId: "",
};
