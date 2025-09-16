// components/organization/wizard/organization-creation-wizard.tsx
"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { WizardProgressHeader } from "./wizard-progress-header";
import { OrganizationDetailsForm } from "./organization-details-form";
import { SubscriptionSelectionForm } from "./subscription-selection-form";
import {
  createOrganizationSchema,
  parseValidationErrors,
  type CreateOrganizationData,
  type FormErrors,
} from "@/lib/schemas/organization";
import {
  subscriptionSchema,
  orgWithSubscriptionSchema,
  parseSubscriptionValidationErrors,
  type SubscriptionData,
  type OrgWithSubscriptionData,
  type SubscriptionFormErrors,
} from "@/lib/schemas/subscription";

interface OrganizationCreationWizardProps {
  onSuccess: (
    orgData: CreateOrganizationData,
    subscriptionData: SubscriptionData
  ) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function OrganizationCreationWizard({
  onSuccess,
  onCancel,
  isSubmitting = false,
}: OrganizationCreationWizardProps) {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isValidatingStep, setIsValidatingStep] = useState(false);

  // Form data state
  const [orgData, setOrgData] = useState<CreateOrganizationData>({
    name: "",
    webhookId: "",
    webhookUrl: "",
    status: "ACTIVE",
    createdBy: "",
  });

  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscriptionType: "ENTERPRISE" as const,
    signaturePlan: undefined,
    verificationPlan: undefined,
    contractPeriodMonths: undefined,
    notes: "",
  });

  // Error state
  const [orgErrors, setOrgErrors] = useState<FormErrors>({});
  const [subscriptionErrors, setSubscriptionErrors] =
    useState<SubscriptionFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Clear API error when form data changes
  useEffect(() => {
    if (apiError) {
      setApiError(null);
    }
  }, [orgData, subscriptionData]);

  // Handle organization form field changes
  const handleOrgInputChange = (
    field: keyof CreateOrganizationData,
    value: string
  ) => {
    setOrgData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (orgErrors[field]) {
      setOrgErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle subscription form field changes
  const handleSubscriptionInputChange = (
    field: keyof SubscriptionData,
    value: any
  ) => {
    setSubscriptionData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (subscriptionErrors[field]) {
      setSubscriptionErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Handle subscription type change
    if (field === "subscriptionType") {
      if (value === "PAY_PER_USE") {
        // Automatically set contract period to 3 months for pay-per-use
        setSubscriptionData((prev) => ({
          ...prev,
          signaturePlan: undefined,
          verificationPlan: undefined,
          contractPeriodMonths: 3, // Fixed at 3 months
        }));
      } else {
        setSubscriptionData((prev) => ({
          ...prev,
          signaturePlan: undefined,
          verificationPlan: undefined,
          contractPeriodMonths: undefined,
        }));
      }
    }
  };

  // Validate Step 1 (Organization details)
  const validateStep1 = (): boolean => {
    try {
      createOrganizationSchema.parse(orgData);
      setOrgErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        const zodError = error as any;
        const errors = parseValidationErrors(zodError);
        setOrgErrors(errors);
      }
      return false;
    }
  };

  // Validate Step 2 (Subscription details)
  const validateStep2 = (): boolean => {
    try {
      // For pay-per-use, ensure contract period is set to 3 months
      if (
        subscriptionData.subscriptionType === "PAY_PER_USE" &&
        !subscriptionData.contractPeriodMonths
      ) {
        setSubscriptionData((prev) => ({ ...prev, contractPeriodMonths: 3 }));
      }

      subscriptionSchema.parse(subscriptionData);
      setSubscriptionErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        const zodError = error as any;
        const errors = parseSubscriptionValidationErrors(zodError);
        setSubscriptionErrors(errors);
      }
      return false;
    }
  };

  // Handle "Choose Subscription" button
  const handleProceedToStep2 = async () => {
    setIsValidatingStep(true);

    // Add small delay to show validation feedback
    setTimeout(() => {
      const isValid = validateStep1();
      if (isValid) {
        setCurrentStep(2);
      }
      setIsValidatingStep(false);
    }, 300);
  };

  // Handle "Back" button
  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  // Handle final form submission
  const handleFinalSubmit = async () => {
    // Validate both steps
    const step1Valid = validateStep1();
    const step2Valid = validateStep2();

    if (!step1Valid || !step2Valid) {
      setApiError("Please fix all validation errors before submitting.");
      return;
    }

    // Combine data and submit
    const combinedData: OrgWithSubscriptionData = {
      ...orgData,
      ...subscriptionData,
    };

    try {
      // Validate combined data
      orgWithSubscriptionSchema.parse(combinedData);

      // Call parent success handler
      onSuccess(orgData, subscriptionData);
    } catch (error) {
      console.error("Final validation error:", error);
      setApiError("Please check all form fields and try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <WizardProgressHeader currentStep={currentStep} totalSteps={2} />

      {/* API Error Alert */}
      {apiError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Organization Details */}
      {currentStep === 1 && (
        <OrganizationDetailsForm
          formData={orgData}
          formErrors={orgErrors}
          isValidating={isValidatingStep}
          onInputChange={handleOrgInputChange}
          onNext={handleProceedToStep2}
          onCancel={onCancel}
        />
      )}

      {/* Step 2: Subscription Selection */}
      {currentStep === 2 && (
        <SubscriptionSelectionForm
          formData={subscriptionData}
          formErrors={subscriptionErrors}
          isSubmitting={isSubmitting}
          onInputChange={handleSubscriptionInputChange}
          onBack={handleBackToStep1}
          onSubmit={handleFinalSubmit}
        />
      )}
    </div>
  );
}
