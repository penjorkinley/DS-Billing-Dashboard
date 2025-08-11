"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import type { SubscriptionData } from "./subscription-overview";

interface UsageMetricsProps {
  subscriptionData: SubscriptionData;
}

export function UsageMetrics({ subscriptionData }: UsageMetricsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return `Nu. ${amount.toLocaleString()}`;
  };

  const getTotalSignatures = () => {
    return (
      subscriptionData.singleSignaturesUsed +
      subscriptionData.multipleSignaturesUsed
    );
  };

  const getTotalCost = () => {
    const singleCost =
      subscriptionData.singleSignaturesUsed *
      subscriptionData.currentRates.singleSignaturePrice;
    const multipleCost =
      subscriptionData.multipleSignaturesUsed *
      subscriptionData.currentRates.multipleSignaturePrice;
    return singleCost + multipleCost;
  };

  const getUsageIntensity = () => {
    const total = getTotalSignatures();
    if (total === 0) return "No Usage";
    if (total < 50) return "Light";
    if (total < 200) return "Moderate";
    if (total < 500) return "Heavy";
    return "Very Heavy";
  };

  const getUsageIntensityColor = () => {
    const intensity = getUsageIntensity();
    switch (intensity) {
      case "No Usage":
        return "bg-gray-100 text-gray-800";
      case "Light":
        return "bg-green-100 text-green-800";
      case "Moderate":
        return "bg-blue-100 text-blue-800";
      case "Heavy":
        return "bg-orange-100 text-orange-800";
      case "Very Heavy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Usage Overview */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Usage Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Usage Summary */}
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">
                {getTotalSignatures().toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Signatures
              </div>
              <Badge className={`${getUsageIntensityColor()} border-0 mt-2`}>
                {getUsageIntensity()} Usage
              </Badge>
            </div>
          </div>

          {/* Usage Breakdown */}
          <div className="space-y-4">
            <h4 className="font-medium">Usage Breakdown</h4>

            <div className="grid gap-4">
              {/* Single Signatures */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Single Signatures</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(
                        subscriptionData.currentRates.singleSignaturePrice
                      )}{" "}
                      per signature
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {subscriptionData.singleSignaturesUsed.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(
                      subscriptionData.singleSignaturesUsed *
                        subscriptionData.currentRates.singleSignaturePrice
                    )}
                  </div>
                </div>
              </div>

              {/* Multiple Signatures */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Multiple Signatures</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(
                        subscriptionData.currentRates.multipleSignaturePrice
                      )}{" "}
                      per signature
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {subscriptionData.multipleSignaturesUsed.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(
                      subscriptionData.multipleSignaturesUsed *
                        subscriptionData.currentRates.multipleSignaturePrice
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Cost */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
              <div className="font-medium">Total Usage Cost</div>
              <div className="text-xl font-bold text-primary">
                {formatCurrency(getTotalCost())}
              </div>
            </div>
          </div>

          {/* Last Usage */}
          {subscriptionData.lastUsageDate && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                Last Usage Activity
              </div>
              <p className="font-medium">
                {formatDate(subscriptionData.lastUsageDate)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Usage Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {subscriptionData.singleSignaturesUsed > 0
                    ? (
                        (subscriptionData.singleSignaturesUsed /
                          getTotalSignatures()) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>
                <div className="text-sm text-muted-foreground">
                  Single Signatures
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {subscriptionData.multipleSignaturesUsed > 0
                    ? (
                        (subscriptionData.multipleSignaturesUsed /
                          getTotalSignatures()) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>
                <div className="text-sm text-muted-foreground">
                  Multiple Signatures
                </div>
              </div>
            </div>

            {/* Average Cost */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Average Cost per Signature
                </span>
                <span className="font-medium">
                  {getTotalSignatures() > 0
                    ? formatCurrency(getTotalCost() / getTotalSignatures())
                    : formatCurrency(0)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
