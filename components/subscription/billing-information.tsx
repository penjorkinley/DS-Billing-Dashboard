"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Users, Info, Calculator } from "lucide-react";

interface BillingInformationProps {
  currentRates: {
    singleSignaturePrice: number;
    multipleSignaturePrice: number;
  };
}

export function BillingInformation({ currentRates }: BillingInformationProps) {
  const formatCurrency = (amount: number) => {
    return `Nu. ${amount.toLocaleString()}`;
  };

  const calculateExampleCosts = () => {
    return [
      {
        description: "1 Single Signature",
        cost: currentRates.singleSignaturePrice,
      },
      {
        description: "3 Multiple Signatures",
        cost: currentRates.multipleSignaturePrice * 3,
      },
      {
        description: "5 Single + 2 Multiple",
        cost:
          currentRates.singleSignaturePrice * 5 +
          currentRates.multipleSignaturePrice * 2,
      },
      {
        description: "10 Multiple Signatures",
        cost: currentRates.multipleSignaturePrice * 10,
      },
    ];
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Current Billing Rates
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pricing structure set by system administrator
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Rates */}
        <div className="space-y-4">
          <h4 className="font-medium">Service Rates</h4>

          <div className="grid gap-4">
            {/* Single Signature Rate */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Single Signature</div>
                  <div className="text-sm text-muted-foreground">
                    Documents requiring one signature
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">
                  {formatCurrency(currentRates.singleSignaturePrice)}
                </div>
                <div className="text-sm text-muted-foreground">
                  per signature
                </div>
              </div>
            </div>

            {/* Multiple Signature Rate */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Multiple Signatures</div>
                  <div className="text-sm text-muted-foreground">
                    Documents requiring multiple signatures
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(currentRates.multipleSignaturePrice)}
                </div>
                <div className="text-sm text-muted-foreground">
                  per signature
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example Calculations */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-4 w-4 text-indigo-600" />
            <h4 className="font-medium">Example Calculations</h4>
          </div>

          <div className="space-y-3">
            {calculateExampleCosts().map((example, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium">
                  {example.description}
                </span>
                <span className="font-bold text-primary">
                  {formatCurrency(example.cost)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Information Note */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-800">Billing Information</h5>
              <div className="text-sm text-blue-700 mt-1 space-y-1">
                <p>
                  • Rates are set by the system administrator and may change
                </p>
                <p>• Single signature: One person signs the document</p>
                <p>
                  • Multiple signatures: More than one person signs the document
                </p>
                <p>
                  • Each signature in a multi-signature document is charged
                  separately
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Summary */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(currentRates.singleSignaturePrice)}
              </div>
              <div className="text-xs text-muted-foreground">Single Rate</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(currentRates.multipleSignaturePrice)}
              </div>
              <div className="text-xs text-muted-foreground">Multiple Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
