// File: components/organization/organization-stats.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp } from "lucide-react";

interface OrganizationStatsProps {
  total: number;
  active: number;
  inactive: number;
  totalRevenue: number;
}

export function OrganizationStats({
  total,
  active,
  inactive,
  totalRevenue,
}: OrganizationStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">
            Total Organizations
          </CardTitle>
          <Building2 className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{total}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">
            Active Organizations
          </CardTitle>
          <div className="h-2 w-2 rounded-full bg-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{active}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-red-50 to-red-100 border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800">
            Inactive Organizations
          </CardTitle>
          <div className="h-2 w-2 rounded-full bg-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900">{inactive}</div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            Nu. {(totalRevenue / 1000).toFixed(0)}k
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
