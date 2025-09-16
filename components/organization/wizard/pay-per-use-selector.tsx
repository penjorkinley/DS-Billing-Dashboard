// components/organization/wizard/pay-per-use-selector.tsx
"use client";

import { Label } from "@/components/ui/label";
import { CheckCircle, Clock, CreditCard } from "lucide-react";
import { PAY_PER_USE_CONFIG } from "@/lib/schemas/subscription";

export function PayPerUseSelector() {
  return (
    <div className="space-y-6">
      {/* Contract Information (Fixed) */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Contract Details</Label>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-blue-800">
              3-Month Contract Period
            </h4>
          </div>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Contract period: 3 months (Quarterly)</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Billing: Quarterly invoicing based on actual usage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pay-Per-Use Summary */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">
          Pay-Per-Use Pricing
        </h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Digital Signatures:</span>
            <span>Nu. {PAY_PER_USE_CONFIG.signaturePrice} per signature</span>
          </div>
          <div className="flex justify-between">
            <span>Verifications:</span>
            <span>
              Nu. {PAY_PER_USE_CONFIG.verificationPrice} per verification
            </span>
          </div>
          <div className="flex justify-between">
            <span>Contract Period:</span>
            <span>3 months</span>
          </div>
          <div className="flex justify-between font-medium text-blue-800">
            <span>Billing Frequency:</span>
            <span>Quarterly (every 3 months)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
