"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle,
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

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-600" />
          Postpaid Subscription Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Bill Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Current Billing Period</h4>
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

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(subscriptionData.currentBillAmount || 0)}
              </span>
              <span className="text-sm text-muted-foreground">
                Current Bill
              </span>
            </div>

            {/* Progress bar showing subscription period */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  isExpired()
                    ? "bg-red-500"
                    : isExpiringSoon()
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${getSubscriptionProgress()}%` }}
              />
            </div>

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Period: {getSubscriptionProgress().toFixed(1)}% complete
              </span>
              {getDaysUntilExpiry() !== null && (
                <span>
                  {getDaysUntilExpiry()! > 0
                    ? `${getDaysUntilExpiry()} days remaining`
                    : `Expired ${Math.abs(getDaysUntilExpiry()!)} days ago`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Subscription Information */}
        <div className="grid gap-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Start Date
              </div>
              <p className="font-medium">
                {formatDate(subscriptionData.subscriptionDate)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                End Date
              </div>
              <p className="font-medium">
                {subscriptionData.subscriptionEndDate
                  ? formatDate(subscriptionData.subscriptionEndDate)
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Billing Cycle
            </div>
            <p className="font-medium">
              {getBillingCycleLabel(subscriptionData.billingCycle || "")}
            </p>
          </div>

          {/* Expiry Warning */}
          {isExpiringSoon() && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-800">
                    Subscription Expiring Soon
                  </h5>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your subscription will expire in {getDaysUntilExpiry()}{" "}
                    days. Please contact your administrator to renew your
                    subscription.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Expired Warning */}
          {isExpired() && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-red-800">
                    Subscription Expired
                  </h5>
                  <p className="text-sm text-red-700 mt-1">
                    Your subscription expired {Math.abs(getDaysUntilExpiry()!)}{" "}
                    days ago. Services may be restricted. Please contact your
                    administrator immediately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Billing Status */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium mb-2">Billing Information</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Billing Model:</span>
                <span className="font-medium">Postpaid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Due:</span>
                <span className="font-medium">
                  {subscriptionData.subscriptionEndDate
                    ? formatDate(subscriptionData.subscriptionEndDate)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span
                  className={`font-medium ${
                    subscriptionData.status === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {subscriptionData.status === "active"
                    ? "Active"
                    : isExpired()
                    ? "Expired"
                    : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
