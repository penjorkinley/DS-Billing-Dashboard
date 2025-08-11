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
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-600" />
          Prepaid Subscription Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Account Balance</h4>
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

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(subscriptionData.remainingBalance || 0)}
              </span>
              <span className="text-sm text-muted-foreground">
                of {formatCurrency(subscriptionData.initialAmount || 0)}
              </span>
            </div>

            <Progress value={getBalancePercentage()} className="h-3" />

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{getBalancePercentage().toFixed(1)}% remaining</span>
              <span>
                {formatCurrency(
                  (subscriptionData.initialAmount || 0) -
                    (subscriptionData.remainingBalance || 0)
                )}{" "}
                used
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Information */}
        <div className="grid gap-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Subscription Date
              </div>
              <p className="font-medium">
                {formatDate(subscriptionData.subscriptionDate)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4" />
                Initial Amount
              </div>
              <p className="font-medium">
                {formatCurrency(subscriptionData.initialAmount || 0)}
              </p>
            </div>
          </div>

          {/* Low Balance Warning */}
          {isLowBalance() && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-800">
                    Low Balance Warning
                  </h5>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your account balance is running low. Consider topping up to
                    avoid service interruption. Current balance:{" "}
                    {formatCurrency(subscriptionData.remainingBalance || 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Account Status */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium mb-2">Account Status</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span
                  className={`font-medium ${
                    subscriptionData.status === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {subscriptionData.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Low Balance Threshold:
                </span>
                <span className="font-medium">
                  {formatCurrency(subscriptionData.lowBalanceThreshold || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
