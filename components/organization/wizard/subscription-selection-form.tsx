// components/organization/wizard/subscription-selection-form.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { EnterprisePlansSelector } from "./enterprise-plans-selector";
import { PayPerUseSelector } from "./pay-per-use-selector";
import type {
  SubscriptionData,
  SubscriptionFormErrors,
  PlanTier,
} from "@/lib/schemas/subscription";

interface SubscriptionSelectionFormProps {
  formData: SubscriptionData;
  formErrors: SubscriptionFormErrors;
  isSubmitting: boolean;
  onInputChange: (field: keyof SubscriptionData, value: any) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function SubscriptionSelectionForm({
  formData,
  formErrors,
  isSubmitting,
  onInputChange,
  onBack,
  onSubmit,
}: SubscriptionSelectionFormProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-1 pt-5 pr-10 pl-12 pb-0">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Choose Subscription Plan</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-12 pb-8 pt-2">
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {/* Subscription Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Subscription Type *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Enterprise Option */}
              <div
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.subscriptionType === "ENTERPRISE"
                    ? "border-green-600 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
                onClick={() => onInputChange("subscriptionType", "ENTERPRISE")}
              >
                {/* Selection Indicator */}
                {formData.subscriptionType === "ENTERPRISE" && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="pr-6">
                  <h3
                    className={`font-semibold mb-1 ${
                      formData.subscriptionType === "ENTERPRISE"
                        ? "text-green-800"
                        : "text-gray-900"
                    }`}
                  >
                    Enterprise Annual Plans
                  </h3>
                  <p
                    className={`text-sm ${
                      formData.subscriptionType === "ENTERPRISE"
                        ? "text-green-700"
                        : "text-muted-foreground"
                    }`}
                  >
                    Fixed annual pricing with included allowances
                  </p>
                </div>
              </div>

              {/* Pay-Per-Use Option */}
              <div
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.subscriptionType === "PAY_PER_USE"
                    ? "border-green-600 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
                onClick={() => onInputChange("subscriptionType", "PAY_PER_USE")}
              >
                {/* Selection Indicator */}
                {formData.subscriptionType === "PAY_PER_USE" && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="pr-6">
                  <h3
                    className={`font-semibold mb-1 ${
                      formData.subscriptionType === "PAY_PER_USE"
                        ? "text-green-800"
                        : "text-gray-900"
                    }`}
                  >
                    Pay-Per-Use Model
                  </h3>
                  <p
                    className={`text-sm ${
                      formData.subscriptionType === "PAY_PER_USE"
                        ? "text-green-700"
                        : "text-muted-foreground"
                    }`}
                  >
                    Nu. 5 per signature, Nu. 20 per verification (Quarterly
                    billing)
                  </p>
                </div>
              </div>
            </div>
            {formErrors.subscriptionType && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {formErrors.subscriptionType}
              </p>
            )}
          </div>

          {/* Enterprise Plan Details */}
          {formData.subscriptionType === "ENTERPRISE" && (
            <EnterprisePlansSelector
              signaturePlan={formData.signaturePlan}
              verificationPlan={formData.verificationPlan}
              errors={formErrors}
              onSignaturePlanChange={(plan) =>
                onInputChange("signaturePlan", plan)
              }
              onVerificationPlanChange={(plan) =>
                onInputChange("verificationPlan", plan)
              }
            />
          )}

          {/* Pay-Per-Use Plan Details */}
          {formData.subscriptionType === "PAY_PER_USE" && <PayPerUseSelector />}

          {/* Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="border-gray-200 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Organization Details
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[220px] bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Organization...
                </>
              ) : (
                "Create Organization & Setup Subscription"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
