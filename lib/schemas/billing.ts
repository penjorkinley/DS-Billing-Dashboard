import { z } from "zod";

// Revenue Models
export const REVENUE_MODELS = {
  PREPAID: "PREPAID",
  POSTPAID: "POSTPAID",
} as const;

export type RevenueModel = (typeof REVENUE_MODELS)[keyof typeof REVENUE_MODELS];

// Billing Cycles for Postpaid
export const BILLING_CYCLES = {
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  HALF_YEARLY: "HALF_YEARLY",
  YEARLY: "YEARLY",
} as const;

export type BillingCycle = (typeof BILLING_CYCLES)[keyof typeof BILLING_CYCLES];

// Billing cycle display mapping
export const CYCLE_DISPLAY_MAP = {
  [BILLING_CYCLES.MONTHLY]: "Monthly",
  [BILLING_CYCLES.QUARTERLY]: "Quarterly",
  [BILLING_CYCLES.HALF_YEARLY]: "Half Yearly",
  [BILLING_CYCLES.YEARLY]: "Yearly",
} as const;

// Simple Pricing Configuration Schema
export const pricingConfigSchema = z.object({
  singleSignaturePrice: z.number().min(0.1, "Price must be greater than 0"),
  multipleSignaturePrice: z.number().min(0.1, "Price must be greater than 0"),
});

// Billing Configuration Schema
export const billingConfigSchema = z.object({
  pricing: pricingConfigSchema,
  enabledBillingCycles: z
    .array(
      z.enum([
        BILLING_CYCLES.MONTHLY,
        BILLING_CYCLES.QUARTERLY,
        BILLING_CYCLES.HALF_YEARLY,
        BILLING_CYCLES.YEARLY,
      ])
    )
    .min(1, "At least one billing cycle must be enabled"),
  updatedBy: z.string().min(1, "Updated by is required"),
  updatedAt: z.date().optional(),
});

// Type exports
export type PricingConfig = z.infer<typeof pricingConfigSchema>;
export type BillingConfig = z.infer<typeof billingConfigSchema>;

// Form errors type
export interface BillingFormErrors {
  [key: string]: string;
}

// Utility function to parse validation errors
export const parseBillingValidationErrors = (
  error: z.ZodError
): BillingFormErrors => {
  const errors: BillingFormErrors = {};
  error.issues.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });
  return errors;
};

// Default values
export const defaultPricingConfig: PricingConfig = {
  singleSignaturePrice: 5,
  multipleSignaturePrice: 8,
};

export const defaultBillingConfig: BillingConfig = {
  pricing: defaultPricingConfig,
  enabledBillingCycles: [
    BILLING_CYCLES.MONTHLY,
    BILLING_CYCLES.QUARTERLY,
    BILLING_CYCLES.HALF_YEARLY,
    BILLING_CYCLES.YEARLY,
  ],
  updatedBy: "",
  updatedAt: new Date(),
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return `Nu. ${amount.toLocaleString()}`;
};

export const calculateSignatureCost = (
  isMultiple: boolean,
  signatureCount: number,
  pricing: PricingConfig
): number => {
  if (!isMultiple) {
    return pricing.singleSignaturePrice;
  } else {
    return signatureCount * pricing.multipleSignaturePrice;
  }
};
