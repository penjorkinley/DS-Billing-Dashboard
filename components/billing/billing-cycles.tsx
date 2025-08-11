"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BILLING_CYCLES, CYCLE_DISPLAY_MAP } from "@/lib/schemas/billing";
import type { BillingCyclesProps } from "./types";

export default function BillingCycles({
  enabledBillingCycles,
  errors,
  onToggle,
}: BillingCyclesProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Postpaid Billing Cycles
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose which billing cycles organizations can select for postpaid
          subscriptions
        </p>
      </CardHeader>

      <CardContent className="pt-0 space-y-6">
        <div className="space-y-4">
          {Object.entries(CYCLE_DISPLAY_MAP).map(([cycle, label]) => (
            <div
              key={cycle}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                id={cycle}
                checked={enabledBillingCycles.includes(cycle as any)}
                onCheckedChange={(checked) => onToggle(cycle, Boolean(checked))}
                className="text-primary"
              />
              <div className="flex-1">
                <Label
                  htmlFor={cycle}
                  className="text-base font-medium cursor-pointer"
                >
                  {label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {cycle === BILLING_CYCLES.MONTHLY &&
                    "Organizations are billed every month"}
                  {cycle === BILLING_CYCLES.QUARTERLY &&
                    "Organizations are billed every 3 months"}
                  {cycle === BILLING_CYCLES.HALF_YEARLY &&
                    "Organizations are billed every 6 months"}
                  {cycle === BILLING_CYCLES.YEARLY &&
                    "Organizations are billed every 12 months"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {errors["enabledBillingCycles"] && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errors["enabledBillingCycles"]}
            </AlertDescription>
          </Alert>
        )}

        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Organizations using the postpaid model will be able to choose from
            the selected billing cycles. They will be charged at the end of each
            billing period based on their usage.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
