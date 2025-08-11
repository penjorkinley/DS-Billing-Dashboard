"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Calendar } from "lucide-react";
import { formatCurrency, CYCLE_DISPLAY_MAP } from "@/lib/schemas/billing";
import type { OverviewCardsProps } from "./types";

export default function OverviewCards({
  pricing,
  enabledBillingCycles,
}: OverviewCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0 shadow-md">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <CreditCard className="h-5 w-5" />
            Prepaid Model
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm text-blue-700">
            Organizations pay upfront and use services until their balance is
            exhausted.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-600">Single Signature:</span>
              <span className="font-medium text-blue-900">
                {formatCurrency(pricing.singleSignaturePrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">Multiple Signature:</span>
              <span className="font-medium text-blue-900">
                {formatCurrency(pricing.multipleSignaturePrice)} per signature
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-0 shadow-md">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Calendar className="h-5 w-5" />
            Postpaid Model
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm text-green-700">
            Organizations choose a billing cycle and pay at the end of the
            period.
          </p>
          <div className="space-y-2 text-sm">
            <div className="text-green-600 font-medium">
              Available Billing Cycles:
            </div>
            <div className="grid grid-cols-2 gap-1">
              {enabledBillingCycles.map((cycle) => (
                <div key={cycle} className="text-green-700">
                  • {CYCLE_DISPLAY_MAP[cycle]}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
