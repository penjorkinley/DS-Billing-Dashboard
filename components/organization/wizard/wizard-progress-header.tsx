// components/organization/wizard/wizard-progress-header.tsx
"use client";

import { CheckCircle } from "lucide-react";

interface WizardProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgressHeader({
  currentStep,
  totalSteps,
}: WizardProgressHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Create New Organization
        </h1>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Step 1 */}
        <div
          className={`flex items-center gap-3 transition-all duration-300 ${
            currentStep >= 1 ? "text-green-600" : "text-gray-400"
          }`}
        >
          <div
            className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              currentStep > 1
                ? "bg-green-600 text-white shadow-lg"
                : currentStep === 1
                ? "bg-green-600 text-white shadow-lg ring-4 ring-green-200"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Organization Details</span>
            <span className="text-xs opacity-75">
              {currentStep > 1
                ? "Completed"
                : currentStep === 1
                ? "Current"
                : "Pending"}
            </span>
          </div>
        </div>

        {/* Progress Line */}
        <div className="relative flex-1 h-0.5 mx-8">
          <div className="absolute inset-0 bg-gray-200 rounded-full" />
          <div
            className={`absolute inset-0 bg-green-600 rounded-full transition-all duration-500 ease-in-out ${
              currentStep >= 2 ? "w-full" : "w-0"
            }`}
          />
        </div>

        {/* Step 2 */}
        <div
          className={`flex items-center gap-3 transition-all duration-300 ${
            currentStep >= 2 ? "text-green-600" : "text-gray-400"
          }`}
        >
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold">Subscription Plans</span>
            <span className="text-xs opacity-75">
              {currentStep > 2
                ? "Completed"
                : currentStep === 2
                ? "Current"
                : "Pending"}
            </span>
          </div>
          <div
            className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              currentStep === 2
                ? "bg-green-600 text-white shadow-lg ring-4 ring-green-200"
                : currentStep > 2
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {currentStep > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
          </div>
        </div>
      </div>
    </div>
  );
}
