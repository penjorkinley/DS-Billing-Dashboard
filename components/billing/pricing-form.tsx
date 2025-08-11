"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { PricingFormProps } from "./types";

export default function PricingForm({
  pricing,
  errors,
  onChange,
}: PricingFormProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Digital Signature Pricing
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Set the pricing for single and multiple signature services (Currency:
          BTN)
        </p>
      </CardHeader>

      <CardContent className="pt-0 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 max-w-2xl">
          {/* Single Signature */}
          <div className="space-y-2">
            <Label htmlFor="singlePrice" className="text-sm font-medium">
              Single Signature Price (BTN) *
            </Label>
            <Input
              id="singlePrice"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="5"
              value={pricing.singleSignaturePrice}
              onChange={(e) =>
                onChange(
                  "singleSignaturePrice",
                  parseFloat(e.target.value) || 0
                )
              }
              className={`text-lg font-medium border border-gray-200 ${
                errors["pricing.singleSignaturePrice"]
                  ? "border-destructive"
                  : ""
              }`}
            />
            {errors["pricing.singleSignaturePrice"] && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors["pricing.singleSignaturePrice"]}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Price charged when a document requires one signature
            </p>
          </div>

          {/* Multiple Signature */}
          <div className="space-y-2">
            <Label htmlFor="multiplePrice" className="text-sm font-medium">
              Multiple Signature Price (BTN per signature) *
            </Label>
            <Input
              id="multiplePrice"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="8"
              value={pricing.multipleSignaturePrice}
              onChange={(e) =>
                onChange(
                  "multipleSignaturePrice",
                  parseFloat(e.target.value) || 0
                )
              }
              className={`text-lg font-medium border border-gray-200 ${
                errors["pricing.multipleSignaturePrice"]
                  ? "border-destructive"
                  : ""
              }`}
            />
            {errors["pricing.multipleSignaturePrice"] && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors["pricing.multipleSignaturePrice"]}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Price charged per signature when a document requires multiple
              signatures
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
