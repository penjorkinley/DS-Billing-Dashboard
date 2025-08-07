"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for different chart types
const revenueData = [
  { month: "Jan", value: 186000, organizations: 20 },
  { month: "Feb", value: 305000, organizations: 21 },
  { month: "Mar", value: 237000, organizations: 22 },
  { month: "Apr", value: 273000, organizations: 22 },
  { month: "May", value: 409000, organizations: 23 },
  { month: "Jun", value: 214000, organizations: 23 },
  { month: "Jul", value: 285000, organizations: 24 },
  { month: "Aug", value: 367000, organizations: 24 },
  { month: "Sep", value: 298000, organizations: 24 },
  { month: "Oct", value: 345000, organizations: 24 },
  { month: "Nov", value: 423000, organizations: 24 },
  { month: "Dec", value: 456000, organizations: 24 },
];

const orgBillingData = [
  { month: "Jan", billing: 18600 },
  { month: "Feb", billing: 20500 },
  { month: "Mar", billing: 23700 },
  { month: "Apr", billing: 27300 },
  { month: "May", billing: 24900 },
  { month: "Jun", billing: 21400 },
  { month: "Jul", billing: 28500 },
  { month: "Aug", billing: 26700 },
  { month: "Sep", billing: 29800 },
  { month: "Oct", billing: 24500 },
  { month: "Nov", billing: 25300 },
  { month: "Dec", billing: 25400 },
];

const usageData = [
  { service: "Identity Verification", usage: 85, maxUsage: 100 },
  { service: "Document Verification", usage: 72, maxUsage: 100 },
  { service: "API Gateway", usage: 93, maxUsage: 100 },
  { service: "Digital Signatures", usage: 67, maxUsage: 100 },
  { service: "Authentication", usage: 88, maxUsage: 100 },
];

const userGrowthData = [
  { month: "Jan", users: 1100, newUsers: 45 },
  { month: "Feb", users: 1150, newUsers: 50 },
  { month: "Mar", users: 1180, newUsers: 30 },
  { month: "Apr", users: 1200, newUsers: 20 },
  { month: "May", users: 1220, newUsers: 20 },
  { month: "Jun", users: 1247, newUsers: 27 },
];

const orgGrowthData = [
  { month: "Jan", users: 120, newUsers: 5 },
  { month: "Feb", users: 128, newUsers: 8 },
  { month: "Mar", users: 135, newUsers: 7 },
  { month: "Apr", users: 140, newUsers: 5 },
  { month: "May", users: 143, newUsers: 3 },
  { month: "Jun", users: 145, newUsers: 2 },
];

const organizationDistribution = [
  { name: "Ministry of IT", value: 145, color: "#0088FE" },
  { name: "Dept of Revenue", value: 87, color: "#00C49F" },
  { name: "Digital Bhutan", value: 203, color: "#FFBB28" },
  { name: "Health Ministry", value: 76, color: "#FF8042" },
  { name: "Education Dept", value: 134, color: "#8884D8" },
  { name: "Others", value: 602, color: "#82CA9D" },
];

type ChartType = "revenue" | "usage" | "growth" | "distribution";

interface ChartAreaInteractiveProps {
  userRole?: "SUPER_ADMIN" | "ORGANIZATION_ADMIN";
}

export function ChartAreaInteractive({
  userRole = "ORGANIZATION_ADMIN",
}: ChartAreaInteractiveProps) {
  const [activeChart, setActiveChart] = useState<ChartType>("revenue");

  const renderChart = () => {
    switch (activeChart) {
      case "revenue":
        const chartData =
          userRole === "SUPER_ADMIN" ? revenueData : orgBillingData;
        const dataKey = userRole === "SUPER_ADMIN" ? "value" : "billing";
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `Nu.${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="font-medium">{label}</p>
                        <p className="text-primary">
                          {userRole === "SUPER_ADMIN"
                            ? "Total Revenue"
                            : "Billing"}
                          : Nu.{(payload[0].value as number).toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "usage":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={usageData}>
              <XAxis
                dataKey="service"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="font-medium">{label}</p>
                        <p className="text-primary">
                          Usage: {payload[0].value}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="usage"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "growth":
        const growthData =
          userRole === "SUPER_ADMIN" ? userGrowthData : orgGrowthData;
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={growthData}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="font-medium">{label}</p>
                        <p className="text-primary">
                          Total Users:{" "}
                          {(payload[0].value as number).toLocaleString()}
                        </p>
                        {payload[1] && (
                          <p className="text-green-600">
                            New Users: {payload[1].value}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "distribution":
        return userRole === "SUPER_ADMIN" ? (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={organizationDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {organizationDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-primary">
                          Users: {data.value.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : null;

      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (activeChart) {
      case "revenue":
        return userRole === "SUPER_ADMIN"
          ? "System Revenue Trends"
          : "Billing Overview";
      case "usage":
        return "Service Usage Analytics";
      case "growth":
        return userRole === "SUPER_ADMIN"
          ? "Platform User Growth"
          : "Organization Growth";
      case "distribution":
        return "User Distribution by Organization";
      default:
        return "Analytics";
    }
  };

  const getChartDescription = () => {
    switch (activeChart) {
      case "revenue":
        return userRole === "SUPER_ADMIN"
          ? "Monthly revenue across all organizations"
          : "Your organization's monthly billing trends";
      case "usage":
        return "Current utilization of digital services";
      case "growth":
        return userRole === "SUPER_ADMIN"
          ? "Total and new user registration trends"
          : "Your organization's user growth";
      case "distribution":
        return "User distribution across different organizations";
      default:
        return "";
    }
  };

  const getAvailableCharts = () => {
    const baseCharts = [
      {
        value: "revenue",
        label: userRole === "SUPER_ADMIN" ? "Revenue" : "Billing",
      },
      { value: "usage", label: "Usage" },
      { value: "growth", label: "Growth" },
    ];

    if (userRole === "SUPER_ADMIN") {
      baseCharts.push({ value: "distribution", label: "Distribution" });
    }

    return baseCharts;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-xl">{getChartTitle()}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {getChartDescription()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={activeChart}
            onValueChange={(value) => setActiveChart(value as ChartType)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getAvailableCharts().map((chart) => (
                <SelectItem key={chart.value} value={chart.value}>
                  {chart.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">{renderChart()}</CardContent>
    </Card>
  );
}
