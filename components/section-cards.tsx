"use client";

import {
  Building2,
  CreditCard,
  Database,
  FileText,
  Server,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  DollarSign,
  Activity,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SubscriptionData } from "@/components/subscription/subscription-overview";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down";
  };
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: MetricCardProps) {
  const TrendIcon = trend?.direction === "up" ? TrendingUp : TrendingDown;
  const trendColor =
    trend?.direction === "up" ? "text-green-600" : "text-red-600";

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mb-1">{description}</p>
        {trend && (
          <div className="flex items-center gap-1">
            <TrendIcon className={`h-3 w-3 ${trendColor}`} />
            <span className={`text-xs font-medium ${trendColor}`}>
              {trend.direction === "up" ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SectionCardsProps {
  userRole?: "SUPER_ADMIN" | "ORGANIZATION_ADMIN";
  subscriptionData?: SubscriptionData;
}

export function SectionCards({
  userRole = "ORGANIZATION_ADMIN",
  subscriptionData,
}: SectionCardsProps) {
  // Helper functions
  const formatCurrency = (amount: number) => `Nu. ${amount.toLocaleString()}`;

  const getBillingCycleLabel = (cycle: string) => {
    const labels = {
      monthly: "Monthly",
      quarterly: "Quarterly",
      half_yearly: "Half Yearly",
      yearly: "Yearly",
    };
    return labels[cycle as keyof typeof labels] || cycle;
  };

  const getTotalUsageCost = (data: SubscriptionData) => {
    return (
      data.singleSignaturesUsed * data.currentRates.singleSignaturePrice +
      data.multipleSignaturesUsed * data.currentRates.multipleSignaturePrice
    );
  };

  const superAdminMetrics = [
    {
      title: "Total Users",
      value: "1,247",
      description: "Across all organizations",
      icon: Users,
      trend: {
        value: 12.5,
        label: "from last month",
        direction: "up" as const,
      },
    },
    {
      title: "Organizations",
      value: "24",
      description: "Active organizations",
      icon: Building2,
      trend: { value: 8.2, label: "from last month", direction: "up" as const },
    },
    {
      title: "System Health",
      value: "99.9%",
      description: "Platform uptime this month",
      icon: Activity,
      trend: { value: 0.1, label: "from last month", direction: "up" as const },
    },
    {
      title: "Total Revenue",
      value: "Nu. 2.4M",
      description: "This month across all orgs",
      icon: DollarSign,
      trend: {
        value: 15.3,
        label: "from last month",
        direction: "up" as const,
      },
    },
  ];

  // Function to get organization admin metrics
  const getOrgAdminMetrics = () => {
    if (!subscriptionData) {
      // Fallback metrics when subscription data is not available
      return [
        {
          title: "Active Users",
          value: "145",
          description: "In your organization",
          icon: Users,
          trend: {
            value: 5.2,
            label: "from last week",
            direction: "up" as const,
          },
        },
        {
          title: "Monthly Usage",
          value: "Nu. 25,400",
          description: "Current billing cycle",
          icon: BarChart3,
          trend: {
            value: 10.1,
            label: "from last month",
            direction: "up" as const,
          },
        },
        {
          title: "Active Services",
          value: "12",
          description: "Digital services running",
          icon: FileText,
          trend: {
            value: 2,
            label: "new this month",
            direction: "up" as const,
          },
        },
        {
          title: "Service Health",
          value: "99.2%",
          description: "Uptime this month",
          icon: Activity,
          trend: {
            value: 0.3,
            label: "from last month",
            direction: "up" as const,
          },
        },
      ];
    }

    // Metrics with actual subscription data
    return [
      {
        title: "Subscription Status",
        value:
          subscriptionData.status === "active"
            ? "Active"
            : subscriptionData.status === "low_balance"
            ? "Low Balance"
            : subscriptionData.status === "expired"
            ? "Expired"
            : "Inactive",
        description:
          subscriptionData.subscriptionType === "prepaid"
            ? `Prepaid - ${formatCurrency(
                subscriptionData.remainingBalance || 0
              )} remaining`
            : `Postpaid - ${getBillingCycleLabel(
                subscriptionData.billingCycle || ""
              )}`,
        icon:
          subscriptionData.subscriptionType === "prepaid"
            ? CreditCard
            : Calendar,
        trend:
          subscriptionData.status === "active"
            ? { value: 0, label: "service active", direction: "up" as const }
            : subscriptionData.status === "low_balance"
            ? {
                value: -15,
                label: "balance warning",
                direction: "down" as const,
              }
            : undefined,
      },
      {
        title: "Total Signatures",
        value: (
          subscriptionData.singleSignaturesUsed +
          subscriptionData.multipleSignaturesUsed
        ).toLocaleString(),
        description: "This billing period",
        icon: FileText,
        trend: {
          value: 12.5,
          label: "from last period",
          direction: "up" as const,
        },
      },
      {
        title: "Usage Cost",
        value: formatCurrency(getTotalUsageCost(subscriptionData)),
        description:
          subscriptionData.subscriptionType === "prepaid"
            ? "Deducted from balance"
            : "Current period charges",
        icon: DollarSign,
        trend: {
          value: 8.3,
          label: "from last period",
          direction: "up" as const,
        },
      },
      {
        title: "Service Health",
        value: "99.2%",
        description: "Uptime this month",
        icon: Activity,
        trend: {
          value: 0.3,
          label: "from last month",
          direction: "up" as const,
        },
      },
    ];
  };

  const metrics =
    userRole === "SUPER_ADMIN" ? superAdminMetrics : getOrgAdminMetrics();

  return (
    <div className="px-4 lg:px-6">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          {userRole === "SUPER_ADMIN"
            ? "System Overview"
            : "Organization Overview"}
        </h2>
        <p className="text-muted-foreground">
          {userRole === "SUPER_ADMIN"
            ? "Monitor system-wide performance and metrics across all organizations."
            : "Track your organization's usage, performance, and billing metrics."}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            icon={metric.icon}
            trend={metric.trend}
          />
        ))}
      </div>
    </div>
  );
}
