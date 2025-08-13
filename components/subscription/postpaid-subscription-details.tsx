"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import type { SubscriptionData } from "./subscription-overview";

interface PostpaidSubscriptionDetailsProps {
  subscriptionData: SubscriptionData;
}

export function PostpaidSubscriptionDetails({
  subscriptionData,
}: PostpaidSubscriptionDetailsProps) {
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

  const getBillingCycleLabel = (cycle: string) => {
    const labels = {
      monthly: "Monthly",
      quarterly: "Quarterly",
      half_yearly: "Half Yearly",
      yearly: "Yearly",
    };
    return labels[cycle as keyof typeof labels] || cycle;
  };

  const getDaysUntilExpiry = () => {
    if (!subscriptionData.subscriptionEndDate) return null;
    const endDate = new Date(subscriptionData.subscriptionEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isExpiringSoon = () => {
    const daysUntilExpiry = getDaysUntilExpiry();
    return (
      daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0
    );
  };

  const isExpired = () => {
    const daysUntilExpiry = getDaysUntilExpiry();
    return daysUntilExpiry !== null && daysUntilExpiry <= 0;
  };

  const getSubscriptionProgress = () => {
    if (!subscriptionData.subscriptionEndDate) return 0;

    const startDate = new Date(subscriptionData.subscriptionDate);
    const endDate = new Date(subscriptionData.subscriptionEndDate);
    const today = new Date();

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = today.getTime() - startDate.getTime();

    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const getProgressColor = () => {
    const progress = getSubscriptionProgress();
    if (progress < 70) return "bg-green-500";
    if (progress < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left Card - Current Billing Information */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              Current Billing
            </CardTitle>
            <Badge
              variant="outline"
              className={`${
                isExpired()
                  ? "border-red-500 text-red-700"
                  : isExpiringSoon()
                  ? "border-yellow-500 text-yellow-700"
                  : "border-green-500 text-green-700"
              }`}
            >
              {isExpired() ? (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Expired
                </>
              ) : isExpiringSoon() ? (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Expiring Soon
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Bill Amount */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(subscriptionData.currentBillAmount || 0)}
              </span>
              <span className="text-sm text-muted-foreground">
                Current charges
              </span>
            </div>

            {/* Subscription Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Billing Period Progress</span>
                <span>{getSubscriptionProgress().toFixed(1)}% elapsed</span>
              </div>
              <Progress value={getSubscriptionProgress()} className="h-3" />
            </div>

            {/* Days Remaining */}
            {getDaysUntilExpiry() !== null && (
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">
                  {getDaysUntilExpiry()! > 0
                    ? `${getDaysUntilExpiry()} days remaining`
                    : `Expired ${Math.abs(getDaysUntilExpiry()!)} days ago`}
                </span>
              </div>
            )}
          </div>

          {/* Billing Cycle Info */}
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Billing Cycle:</span>
              <span className="text-sm font-semibold">
                {getBillingCycleLabel(subscriptionData.billingCycle || "")}
              </span>
            </div>
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
          </div>

          {/* Expiry Warning */}
          {isExpiringSoon() && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-yellow-800 text-sm">
                    Subscription Expiring Soon
                  </h5>
                  <p className="text-xs text-yellow-700 mt-1">
                    Your subscription will expire in {getDaysUntilExpiry()}{" "}
                    days. Please contact your administrator to renew.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Expired Warning */}
          {isExpired() && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-red-800 text-sm">
                    Subscription Expired
                  </h5>
                  <p className="text-xs text-red-700 mt-1">
                    Your subscription expired {Math.abs(getDaysUntilExpiry()!)}{" "}
                    days ago. Services may be restricted.
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
            <Calendar className="h-5 w-5 text-blue-600" />
            Subscription Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subscription Dates */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Start Date
              </div>
              <p className="text-lg font-semibold">
                {formatDate(subscriptionData.subscriptionDate)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                End Date
              </div>
              <p className="text-lg font-semibold">
                {subscriptionData.subscriptionEndDate
                  ? formatDate(subscriptionData.subscriptionEndDate)
                  : "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Billing Frequency
              </div>
              <p className="text-lg font-semibold">
                {getBillingCycleLabel(subscriptionData.billingCycle || "")}
              </p>
            </div>
          </div>

          {/* Subscription Duration */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-800">
                Total Duration:
              </span>
              <span className="text-sm font-semibold text-blue-900">
                {subscriptionData.subscriptionEndDate && (
                  <>
                    {Math.ceil(
                      (new Date(
                        subscriptionData.subscriptionEndDate
                      ).getTime() -
                        new Date(subscriptionData.subscriptionDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </>
                )}
              </span>
            </div>
            <div className="text-xs text-blue-700">
              From {formatDate(subscriptionData.subscriptionDate)} to{" "}
              {subscriptionData.subscriptionEndDate
                ? formatDate(subscriptionData.subscriptionEndDate)
                : "N/A"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
