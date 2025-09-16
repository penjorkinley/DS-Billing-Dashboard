// components/organization/wizard/enterprise-plans-selector.tsx
"use client";

import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import {
  ENTERPRISE_PLANS,
  formatCurrency,
  type PlanTier,
  type SubscriptionFormErrors,
} from "@/lib/schemas/subscription";

interface EnterprisePlansSelectorProps {
  signaturePlan?: PlanTier;
  verificationPlan?: PlanTier;
  errors: SubscriptionFormErrors;
  onSignaturePlanChange: (plan: PlanTier) => void;
  onVerificationPlanChange: (plan: PlanTier) => void;
}

export function EnterprisePlansSelector({
  signaturePlan,
  verificationPlan,
  errors,
  onSignaturePlanChange,
  onVerificationPlanChange,
}: EnterprisePlansSelectorProps) {
  // Calculate total cost
  const getTotal = () => {
    if (signaturePlan && verificationPlan) {
      const sigPrice = ENTERPRISE_PLANS.SIGNATURE_PLANS[signaturePlan].price;
      const verPrice =
        ENTERPRISE_PLANS.VERIFICATION_PLANS[verificationPlan].price;
      return sigPrice + verPrice;
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Digital Signature Plan */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Digital Signature Plan *
        </Label>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {Object.entries(ENTERPRISE_PLANS.SIGNATURE_PLANS).map(
            ([key, plan]) => (
              <div
                key={key}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  signaturePlan === key
                    ? "border-green-600 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
                onClick={() => onSignaturePlanChange(key as PlanTier)}
              >
                {/* Selection Indicator */}
                {signaturePlan === key && (
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

                <div className="flex items-start justify-between pr-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={`font-medium ${
                          signaturePlan === key
                            ? "text-green-800"
                            : "text-gray-900"
                        }`}
                      >
                        {plan.name}
                      </h4>
                    </div>
                    <p
                      className={`text-sm mb-2 ${
                        signaturePlan === key
                          ? "text-green-700"
                          : "text-muted-foreground"
                      }`}
                    >
                      {plan.description}
                    </p>
                    <p
                      className={`text-sm ${
                        signaturePlan === key
                          ? "text-green-800"
                          : "text-gray-700"
                      }`}
                    >
                      {plan.signatures === "unlimited"
                        ? "Unlimited signatures"
                        : `${plan.signatures.toLocaleString()} signatures`}
                    </p>
                    {plan.overageRate > 0 && (
                      <p
                        className={`text-xs ${
                          signaturePlan === key
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        Nu. {plan.overageRate} per additional signature
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        signaturePlan === key
                          ? "text-green-800"
                          : "text-gray-900"
                      }`}
                    >
                      {formatCurrency(plan.price)}
                    </p>
                    <p
                      className={`text-xs ${
                        signaturePlan === key
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      per year
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        {errors.signaturePlan && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.signaturePlan}
          </p>
        )}
      </div>

      {/* Verification Plan */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Verification Plan *</Label>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {Object.entries(ENTERPRISE_PLANS.VERIFICATION_PLANS).map(
            ([key, plan]) => (
              <div
                key={key}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  verificationPlan === key
                    ? "border-green-600 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
                onClick={() => onVerificationPlanChange(key as PlanTier)}
              >
                {/* Selection Indicator */}
                {verificationPlan === key && (
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

                <div className="flex items-start justify-between pr-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={`font-medium ${
                          verificationPlan === key
                            ? "text-green-800"
                            : "text-gray-900"
                        }`}
                      >
                        {plan.name}
                      </h4>
                    </div>
                    <p
                      className={`text-sm mb-2 ${
                        verificationPlan === key
                          ? "text-green-700"
                          : "text-muted-foreground"
                      }`}
                    >
                      {plan.description}
                    </p>
                    <p
                      className={`text-sm ${
                        verificationPlan === key
                          ? "text-green-800"
                          : "text-gray-700"
                      }`}
                    >
                      {plan.verifications === "unlimited"
                        ? "Unlimited verifications"
                        : `${plan.verifications.toLocaleString()} verifications`}
                    </p>
                    {plan.overageRate > 0 && (
                      <p
                        className={`text-xs ${
                          verificationPlan === key
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        Nu. {plan.overageRate} per additional verification
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        verificationPlan === key
                          ? "text-green-800"
                          : "text-gray-900"
                      }`}
                    >
                      {formatCurrency(plan.price)}
                    </p>
                    <p
                      className={`text-xs ${
                        verificationPlan === key
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      per year
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        {errors.verificationPlan && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.verificationPlan}
          </p>
        )}
      </div>

      {/* Enterprise Total Summary */}
      {signaturePlan && verificationPlan && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">
            Subscription Summary
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Digital Signature Plan:</span>
              <span>
                {ENTERPRISE_PLANS.SIGNATURE_PLANS[signaturePlan].name} -{" "}
                {formatCurrency(
                  ENTERPRISE_PLANS.SIGNATURE_PLANS[signaturePlan].price
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Verification Plan:</span>
              <span>
                {ENTERPRISE_PLANS.VERIFICATION_PLANS[verificationPlan].name} -{" "}
                {formatCurrency(
                  ENTERPRISE_PLANS.VERIFICATION_PLANS[verificationPlan].price
                )}
              </span>
            </div>
            <div className="border-t border-green-300 pt-2 mt-2">
              <div className="flex justify-between font-semibold text-green-800">
                <span>Total Annual Cost:</span>
                <span>{formatCurrency(getTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
