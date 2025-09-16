// lib/schemas/subscription.ts
import { z } from "zod";

// Subscription Types
export const SUBSCRIPTION_TYPES = {
  ENTERPRISE: "ENTERPRISE",
  PAY_PER_USE: "PAY_PER_USE",
} as const;

export type SubscriptionType =
  (typeof SUBSCRIPTION_TYPES)[keyof typeof SUBSCRIPTION_TYPES];

// Enterprise Plan Tiers
export const PLAN_TIERS = {
  BASIC: "BASIC",
  PLUS: "PLUS",
  PREMIUM: "PREMIUM",
  ELITE: "ELITE",
} as const;

export type PlanTier = (typeof PLAN_TIERS)[keyof typeof PLAN_TIERS];

// Contract Periods for Pay-Per-Use (Fixed at 3 months - quarterly billing)
export const CONTRACT_PERIODS = {
  QUARTERLY: 3,
} as const;

export type ContractPeriod =
  (typeof CONTRACT_PERIODS)[keyof typeof CONTRACT_PERIODS];

// Subscription Data Schema
export const subscriptionSchema = z
  .object({
    subscriptionType: z.enum(["ENTERPRISE", "PAY_PER_USE"], {
      error: "Please select a subscription type",
    }),

    // Enterprise Plan Fields
    signaturePlan: z.enum(["BASIC", "PLUS", "PREMIUM", "ELITE"]).optional(),
    verificationPlan: z.enum(["BASIC", "PLUS", "PREMIUM", "ELITE"]).optional(),

    // Pay-Per-Use Fields (Fixed 3-month contract period)
    contractPeriodMonths: z.literal(3).optional(),

    // Optional
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // Enterprise requires both signature and verification plans
      if (data.subscriptionType === "ENTERPRISE") {
        return data.signaturePlan && data.verificationPlan;
      }
      // Pay-per-use automatically sets contract period to 3 months
      return true;
    },
    {
      message: "Please complete all required subscription fields",
      path: ["subscriptionType"], // Show error on subscription type field
    }
  );

// Combined Organization + Subscription Schema
export const orgWithSubscriptionSchema = z
  .object({
    // Organization fields (from existing schema)
    name: z.string().min(1, "Organization name is required"),
    webhookId: z.string().min(1, "Webhook ID is required"),
    webhookUrl: z.string().url("Must be a valid URL"),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
    createdBy: z.string().min(1, "Created by is required"),

    // Subscription fields
    subscriptionType: z.enum(["ENTERPRISE", "PAY_PER_USE"]),
    signaturePlan: z.enum(["BASIC", "PLUS", "PREMIUM", "ELITE"]).optional(),
    verificationPlan: z.enum(["BASIC", "PLUS", "PREMIUM", "ELITE"]).optional(),
    contractPeriodMonths: z.literal(3).optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.subscriptionType === "ENTERPRISE") {
        return data.signaturePlan && data.verificationPlan;
      }
      // Pay-per-use automatically sets contract period to 3 months
      return true;
    },
    {
      message: "Please complete all required subscription fields",
    }
  );

// Type exports
export type SubscriptionData = z.infer<typeof subscriptionSchema>;
export type OrgWithSubscriptionData = z.infer<typeof orgWithSubscriptionSchema>;

// Enterprise Plans Configuration
export const ENTERPRISE_PLANS = {
  SIGNATURE_PLANS: {
    BASIC: {
      name: "Basic",
      price: 100000, // Nu. 100,000
      signatures: 20000,
      overageRate: 5, // Nu. 5 per additional signature
      description: "Perfect for small organizations",
    },
    PLUS: {
      name: "Plus",
      price: 200000, // Nu. 200,000
      signatures: 50000,
      overageRate: 4, // Nu. 4 per additional signature
      description: "Perfect for medium organizations",
    },
    PREMIUM: {
      name: "Premium",
      price: 300000, // Nu. 300,000
      signatures: 100000,
      overageRate: 3, // Nu. 3 per additional signature
      description: "Perfect for large organizations",
    },
    ELITE: {
      name: "Elite",
      price: 800000, // Nu. 800,000
      signatures: "unlimited",
      overageRate: 0,
      description: "Perfect for enterprise organizations",
    },
  },
  VERIFICATION_PLANS: {
    BASIC: {
      name: "Basic",
      price: 10000, // Nu. 10,000
      verifications: 500,
      overageRate: 20, // Nu. 20 per additional verification
      description: "Perfect for small organizations",
    },
    PLUS: {
      name: "Plus",
      price: 20000, // Nu. 20,000
      verifications: 2000,
      overageRate: 10, // Nu. 10 per additional verification
      description: "Perfect for medium organizations",
    },
    PREMIUM: {
      name: "Premium",
      price: 35000, // Nu. 35,000
      verifications: 5000,
      overageRate: 7, // Nu. 7 per additional verification
      description: "Perfect for large organizations",
    },
    ELITE: {
      name: "Elite",
      price: 50000, // Nu. 50,000
      verifications: "unlimited",
      overageRate: 0,
      description: "Perfect for enterprise organizations",
    },
  },
} as const;

// Pay-Per-Use Configuration
export const PAY_PER_USE_CONFIG = {
  signaturePrice: 5, // Nu. 5 per signature
  verificationPrice: 20, // Nu. 20 per verification
  contractPeriodMonths: 3, // Fixed 3-month contract period
  billingFrequency: "quarterly", // Quarterly billing/invoicing
  contractPeriods: [{ months: 3, label: "3 months (Quarterly billing)" }],
} as const;

// Utility Functions
export const formatCurrency = (amount: number): string => {
  return `Nu. ${amount.toLocaleString()}`;
};

export const calculateEnterpriseTotal = (
  signaturePlan: PlanTier,
  verificationPlan: PlanTier
): number => {
  const sigPrice = ENTERPRISE_PLANS.SIGNATURE_PLANS[signaturePlan].price;
  const verPrice = ENTERPRISE_PLANS.VERIFICATION_PLANS[verificationPlan].price;
  return sigPrice + verPrice;
};

export const getEnterprisePlanDetails = (
  signaturePlan: PlanTier,
  verificationPlan: PlanTier
) => {
  return {
    signature: ENTERPRISE_PLANS.SIGNATURE_PLANS[signaturePlan],
    verification: ENTERPRISE_PLANS.VERIFICATION_PLANS[verificationPlan],
    total: calculateEnterpriseTotal(signaturePlan, verificationPlan),
  };
};

// Form validation helpers
export interface SubscriptionFormErrors {
  [key: string]: string;
}

export const parseSubscriptionValidationErrors = (
  error: z.ZodError
): SubscriptionFormErrors => {
  const errors: SubscriptionFormErrors = {};
  error.issues.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });
  return errors;
};

// Default values
export const defaultSubscriptionValues: Partial<SubscriptionData> = {
  subscriptionType: undefined,
  signaturePlan: undefined,
  verificationPlan: undefined,
  contractPeriodMonths: 3, // Default to 3 months for pay-per-use
  notes: "",
};
