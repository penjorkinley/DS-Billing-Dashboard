"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Wallet, Calendar, TrendingDown, AlertTriangle } from "lucide-react";
import type { SubscriptionData } from "./subscription-overview";

interface PrepaidSubscriptionDetailsProps {
  subscriptionData: SubscriptionData;
}

export function PrepaidSubscriptionDetails({
  subscriptionData,
}: PrepaidSubscriptionDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `Nu. ${amount.toLocaleString()}`;
  };

  const getBalancePercentage = () => {
    if (!subscriptionData.initialAmount || !subscriptionData.remainingBalance)
      return 0;
    return (
      (subscriptionData.remainingBalance / subscriptionData.initialAmount) * 100
    );
  };

  const isLowBalance = () => {
    if (
      !subscriptionData.remainingBalance ||
      !subscriptionData.lowBalanceThreshold
    )
      return false;
    return (
      subscriptionData.remainingBalance <= subscriptionData.lowBalanceThreshold
    );
  };

  const getProgressColor = () => {
    const percentage = getBalancePercentage();
    if (percentage > 50) return "bg-green-500";
    if (percentage > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left Card - Account Balance Information */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              Account Balance
            </CardTitle>
            {isLowBalance() && (
              <Badge
                variant="outline"
                className="border-yellow-500 text-yellow-700"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Low Balance
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Balance Display */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(subscriptionData.remainingBalance || 0)}
              </span>
              <span className="text-sm text-muted-foreground">
                of {formatCurrency(subscriptionData.initialAmount || 0)}
              </span>
            </div>

            <Progress value={getBalancePercentage()} className="h-3" />

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {getBalancePercentage().toFixed(1)}% remaining
              </span>
              <span className="text-muted-foreground">
                {formatCurrency(
                  (subscriptionData.initialAmount || 0) -
                    (subscriptionData.remainingBalance || 0)
                )}{" "}
                used
              </span>
            </div>
          </div>

          {/* Account Status */}
          <div className="py-3 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status:</span>
              <span
                className={`text-sm font-semibold ${
                  subscriptionData.status === "active"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {subscriptionData.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Low Balance Alert:</span>
              <span className="text-sm font-semibold">
                {formatCurrency(subscriptionData.lowBalanceThreshold || 0)}
              </span>
            </div>
          </div>

          {/* Low Balance Warning */}
          {isLowBalance() && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-yellow-800 text-sm">
                    Low Balance Warning
                  </h5>
                  <p className="text-xs text-yellow-700 mt-1">
                    Your account balance is running low. Consider topping up to
                    avoid service interruption.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Card - Subscription Information */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Subscription Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subscription Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Subscription Date
              </div>
              <p className="text-lg font-semibold">
                {formatDate(subscriptionData.subscriptionDate)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4" />
                Initial Amount
              </div>
              <p className="text-lg font-semibold">
                {formatCurrency(subscriptionData.initialAmount || 0)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                Total Used
              </div>
              <p className="text-lg font-semibold">
                {formatCurrency(
                  (subscriptionData.initialAmount || 0) -
                    (subscriptionData.remainingBalance || 0)
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
