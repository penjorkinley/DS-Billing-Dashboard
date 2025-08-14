"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { type OrganizationDisplay } from "@/lib/schemas/organization";

interface OrganizationStatsProps {
  organizations: OrganizationDisplay[];
}

export function OrganizationStats({ organizations }: OrganizationStatsProps) {
  // Calculate stats from the actual data
  const totalOrganizations = organizations.length;
  const activeOrganizations = organizations.filter(
    (org) => org.status === "active"
  ).length;
  const inactiveOrganizations = organizations.filter(
    (org) => org.status === "inactive"
  ).length;

  // Calculate total revenue from dummy monthly revenue data
  const totalRevenue = organizations.reduce(
    (sum, org) => sum + org.monthlyRevenue,
    0
  );

  const stats = [
    {
      title: "Total Organizations",
      value: totalOrganizations,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "All registered organizations",
    },
    {
      title: "Active Organizations",
      value: activeOrganizations,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Currently active organizations",
    },
    {
      title: "Inactive Organizations",
      value: inactiveOrganizations,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "Inactive organizations",
    },
    {
      title: "Total Monthly Revenue",
      value: totalRevenue,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Combined monthly revenue",
      isRevenue: true,
    },
  ];

  const formatValue = (value: number, isRevenue?: boolean) => {
    if (isRevenue) {
      return `Nu. ${value.toLocaleString()}`;
    }
    return value.toString();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatValue(stat.value, stat.isRevenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
