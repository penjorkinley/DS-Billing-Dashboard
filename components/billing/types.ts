import type {
  BillingConfig,
  BillingFormErrors,
  PricingConfig,
} from "@/lib/schemas/billing";

export type SaveHandler = () => Promise<void> | void;

export type PricingFormProps = {
  pricing: PricingConfig;
  errors: BillingFormErrors;
  onChange: (field: keyof PricingConfig, value: number) => void;
};

export type PricingExamplesProps = {
  pricing: PricingConfig;
};

export type OverviewCardsProps = {
  pricing: PricingConfig;
  enabledBillingCycles: BillingConfig["enabledBillingCycles"];
};

export type ConfigurationSummaryProps = {
  pricing: PricingConfig;
  enabledBillingCycles: BillingConfig["enabledBillingCycles"];
};

export type BillingCyclesProps = {
  enabledBillingCycles: BillingConfig["enabledBillingCycles"];
  errors: BillingFormErrors;
  onToggle: (cycle: string, checked: boolean) => void;
};

export type BillingHeaderProps = {
  isSubmitting: boolean;
  onSave: SaveHandler;
};
