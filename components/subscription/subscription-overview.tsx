"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrepaidSubscriptionDetails } from "./prepaid-subscription-details";
import { PostpaidSubscriptionDetails } from "./postpaid-subscription-details";
import { UsageMetrics } from "./usage-metrics";
import { BillingInformation } from "./billing-information";
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

export interface SubscriptionData {
  id: string;
  organizationName: string;
  subscriptionType: "prepaid" | "postpaid";
  status: "active" | "inactive" | "expired" | "low_balance";
  subscriptionDate: string;

  // Prepaid specific
  initialAmount?: number;
  remainingBalance?: number;
  lowBalanceThreshold?: number;

  // Postpaid specific
  billingCycle?: "monthly" | "quarterly" | "half_yearly" | "yearly";
  subscriptionEndDate?: string;
  currentBillAmount?: number;

  // Usage data
  singleSignaturesUsed: number;
  multipleSignaturesUsed: number;
  lastUsageDate?: string;

  // Billing rates (from super admin configuration)
  currentRates: {
    singleSignaturePrice: number;
    multipleSignaturePrice: number;
  };
}

interface SubscriptionOverviewProps {
  subscriptionData: SubscriptionData;
}

export function SubscriptionOverview({
  subscriptionData,
}: SubscriptionOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "inactive":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "expired":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "low_balance":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "inactive":
      case "expired":
        return <AlertTriangle className="h-4 w-4" />;
      case "low_balance":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "expired":
        return "Expired";
      case "low_balance":
        return "Low Balance";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Subscription Status Header */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {subscriptionData.subscriptionType === "prepaid" ? (
                  <CreditCard className="h-6 w-6 text-primary" />
                ) : (
                  <Calendar className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {subscriptionData.organizationName}
                </CardTitle>
                <p className="text-muted-foreground">
                  {subscriptionData.subscriptionType === "prepaid"
                    ? "Prepaid Subscription"
                    : "Postpaid Subscription"}
                </p>
              </div>
            </div>
            <Badge
              className={`${getStatusColor(
                subscriptionData.status
              )} border-0 px-3 py-1 text-sm font-medium`}
            >
              {getStatusIcon(subscriptionData.status)}
              <span className="ml-1">
                {getStatusText(subscriptionData.status)}
              </span>
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Subscription Details Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Subscription Details */}
        <div className="space-y-6">
          {subscriptionData.subscriptionType === "prepaid" ? (
            <PrepaidSubscriptionDetails subscriptionData={subscriptionData} />
          ) : (
            <PostpaidSubscriptionDetails subscriptionData={subscriptionData} />
          )}

          <BillingInformation currentRates={subscriptionData.currentRates} />
        </div>

        {/* Right Column - Usage Metrics */}
        <div>
          <UsageMetrics subscriptionData={subscriptionData} />
        </div>
      </div>
    </div>
  );
}
