"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";
import {
  formatCurrency,
  calculateSignatureCost,
  CYCLE_DISPLAY_MAP,
} from "@/lib/schemas/billing";
import type { ConfigurationSummaryProps } from "./types";

export default function ConfigurationSummary({
  pricing,
  enabledBillingCycles,
}: ConfigurationSummaryProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Current Configuration Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="font-medium text-lg">Pricing Structure</h4>
            <div className="space-y-2 text-sm bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between">
                <span>Single Signature:</span>
                <span className="font-medium">
                  {formatCurrency(pricing.singleSignaturePrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Multiple Signature:</span>
                <span className="font-medium">
                  {formatCurrency(pricing.multipleSignaturePrice)} per signature
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-600">
                  Example: 4 signatures ={" "}
                  {formatCurrency(calculateSignatureCost(true, 4, pricing))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-lg">Available Options</h4>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium mb-2">Revenue Models:</div>
                <div className="space-y-1">
                  <div>• Prepaid - Pay upfront, use until exhausted</div>
                  <div>• Postpaid - Pay at end of billing cycle</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium mb-2">Postpaid Billing Cycles:</div>
                <div className="grid grid-cols-2 gap-1">
                  {enabledBillingCycles.map((cycle) => (
                    <div key={cycle}>• {CYCLE_DISPLAY_MAP[cycle]}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
