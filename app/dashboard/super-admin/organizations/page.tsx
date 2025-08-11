// File: app/dashboard/super-admin/organizations/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/lib/toast-context";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Building2,
  TrendingUp,
  Calendar,
  Grid3X3,
  List,
  Edit,
  Loader2,
} from "lucide-react";

// Import the properly structured components
import { EditOrganizationDialog } from "@/components/organization/edit-organization-dialog";
import {
  type Organization,
  type EditOrganizationData,
} from "@/lib/schemas/organization";

// Sample organization data - in real app, this would come from an API
const organizationsData: Organization[] = [
  {
    id: "ORG001",
    name: "Ministry of Information Technology",
    shortName: "MIT",
    status: "active",
    revenue: 25400,
    createdAt: "2023-03-15",
    contactEmail: "admin@mit.gov.bt",
    subscription: "postpaid",
  },
  {
    id: "ORG002",
    name: "Department of Revenue & Customs",
    shortName: "DRC",
    status: "active",
    revenue: 18200,
    createdAt: "2023-05-22",
    contactEmail: "admin@drc.gov.bt",
    subscription: "prepaid",
  },
  {
    id: "ORG003",
    name: "Digital Bhutan Corporation",
    shortName: "DBC",
    status: "active",
    revenue: 35600,
    createdAt: "2023-01-10",
    contactEmail: "support@digitalBhutan.bt",
    subscription: "postpaid",
  },
  {
    id: "ORG004",
    name: "Ministry of Health",
    shortName: "MOH",
    status: "inactive",
    revenue: 12800,
    createdAt: "2023-07-08",
    contactEmail: "admin@health.gov.bt",
    subscription: "prepaid",
  },
  {
    id: "ORG005",
    name: "Department of Education",
    shortName: "DOE",
    status: "active",
    revenue: 22900,
    createdAt: "2023-04-12",
    contactEmail: "admin@education.gov.bt",
    subscription: "postpaid",
  },
  {
    id: "ORG006",
    name: "Royal Insurance Corporation",
    shortName: "RIC",
    status: "active",
    revenue: 19500,
    createdAt: "2023-06-18",
    contactEmail: "tech@ric.bt",
    subscription: "prepaid",
  },
  {
    id: "ORG007",
    name: "Bhutan Power Corporation",
    shortName: "BPC",
    status: "active",
    revenue: 28900,
    createdAt: "2023-02-28",
    contactEmail: "digital@bpc.bt",
    subscription: "postpaid",
  },
  {
    id: "ORG008",
    name: "National Statistics Bureau",
    shortName: "NSB",
    status: "inactive",
    revenue: 8900,
    createdAt: "2023-09-05",
    contactEmail: "it@nsb.gov.bt",
    subscription: "prepaid",
  },
];

type ViewMode = "grid" | "table";

export default function AllOrganizationsPage() {
  const { user, loading, error, isAuthenticated } = useAuth({
    requiredRole: "SUPER_ADMIN",
  });
  const router = useRouter();
  const { showToast } = useToast();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [organizations, setOrganizations] =
    useState<Organization[]>(organizationsData);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        showToast({
          type: "success",
          title: "Logged Out",
          message: "You have been successfully logged out. Redirecting...",
          duration: 2000,
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        showToast({
          type: "error",
          title: "Logout Error",
          message: "Failed to logout properly. Redirecting anyway...",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error) {
      console.error("Logout error:", error);
      showToast({
        type: "error",
        title: "Connection Error",
        message: "Failed to logout properly. Redirecting anyway...",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  // Handle organization update
  const handleOrganizationUpdate = (
    orgId: string,
    updatedData: EditOrganizationData
  ) => {
    setOrganizations((prev) =>
      prev.map((org) =>
        org.id === orgId
          ? {
              ...org,
              name: updatedData.name,
              status: updatedData.status,
              contactEmail: updatedData.contactEmail,
              subscription: updatedData.subscription,
            }
          : org
      )
    );

    showToast({
      type: "success",
      title: "Organization Updated",
      message: `${updatedData.name} has been successfully updated.`,
      duration: 3000,
    });
  };

  // Filter and search logic
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.shortName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || org.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [organizations, searchQuery, statusFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = organizations.length;
    const active = organizations.filter(
      (org) => org.status === "active"
    ).length;
    const inactive = total - active;
    const totalRevenue = organizations.reduce(
      (sum, org) => sum + org.revenue,
      0
    );

    return { total, active, inactive, totalRevenue };
  }, [organizations]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
          <span className="text-muted-foreground">
            Verifying authentication...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error || "Authentication failed"}
          </p>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "280px",
          "--header-height": "60px",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        userRole="SUPER_ADMIN"
        user={user}
        onLogout={handleLogout}
        variant="inset"
      />
      <SidebarInset>
        <SiteHeader
          user={user}
          breadcrumbItems={[
            { title: "Super Administrator", href: "/dashboard/super-admin" },
            {
              title: "Organizations",
              href: "/dashboard/super-admin/organizations",
            },
            { title: "All Organizations" },
          ]}
        />

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 py-6">
            {/* Header Section */}
            <div className="px-4 lg:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    All Organizations
                  </h1>
                  <p className="text-muted-foreground">
                    Manage and monitor all organizations in your system
                  </p>
                </div>
                <Button
                  className="w-fit bg-green-600 hover:bg-green-700 text-white border-0"
                  onClick={() => router.push("/dashboard/super-admin/create")}
                >
                  Add Organization
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="px-4 lg:px-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-800">
                      Total Organizations
                    </CardTitle>
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900">
                      {stats.total}
                    </div>
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
                    <div className="text-2xl font-bold text-green-900">
                      {stats.active}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-red-50 to-red-100 border-0 shadow-md ">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-red-800">
                      Inactive Organizations
                    </CardTitle>
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-900">
                      {stats.inactive}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      Nu. {(stats.totalRevenue / 1000).toFixed(0)}k
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="px-4 lg:px-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 gap-4">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search organizations..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={`h-8 px-3 ${
                          viewMode === "grid" ? "bg-white shadow-sm" : ""
                        }`}
                      >
                        <Grid3X3 className="h-4 w-4 mr-1" />
                        Cards
                      </Button>
                      <Button
                        variant={viewMode === "table" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("table")}
                        className={`h-8 px-3 ${
                          viewMode === "table" ? "bg-white shadow-sm" : ""
                        }`}
                      >
                        <List className="h-4 w-4 mr-1" />
                        Table
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Showing {filteredOrganizations.length} of{" "}
                      {organizations.length} organizations
                    </span>
                    {(searchQuery || statusFilter !== "all") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Organizations Display */}
            <div className="px-4 lg:px-6">
              {viewMode === "grid" ? (
                /* Grid View */
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredOrganizations.map((org) => (
                    <Card
                      key={org.id}
                      className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1 "
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                              {org.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1 font-medium">
                              {org.shortName}
                            </p>
                          </div>
                          <EditOrganizationDialog
                            organization={org}
                            onSave={handleOrganizationUpdate}
                          >
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </EditOrganizationDialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge
                              variant={
                                org.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                org.status === "active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100 border-0"
                                  : "bg-red-100 text-red-800 hover:bg-red-100 border-0"
                              }
                            >
                              {org.status === "active"
                                ? "● Active"
                                : "● Inactive"}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {org.subscription}
                            </Badge>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                Monthly Revenue
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                Nu. {(org.revenue / 1000).toFixed(0)}k
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Created:{" "}
                              {new Date(org.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                /* Table View */
                <Card className="border-0 shadow-lg">
                  <div className="px-4">
                    <Table className="border-gray-200">
                      <TableHeader>
                        <TableRow className="border-gray-200">
                          <TableHead>Organization</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Subscription</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                          <TableHead>Created Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrganizations.map((org) => (
                          <TableRow
                            key={org.id}
                            className="group border-gray-200"
                          >
                            <TableCell className="border-gray-200">
                              <div>
                                <div className="font-medium text-base">
                                  {org.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {org.shortName} • {org.contactEmail}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="border-gray-200">
                              <Badge
                                variant={
                                  org.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  org.status === "active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100 border-0"
                                    : "bg-red-100 text-red-800 hover:bg-red-100 border-0"
                                }
                              >
                                {org.status === "active"
                                  ? "● Active"
                                  : "● Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="border-gray-200">
                              <Badge
                                variant="outline"
                                className="capitalize border-gray-200"
                              >
                                {org.subscription}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium border-gray-200">
                              Nu. {org.revenue.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground border-gray-200">
                              {new Date(org.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </TableCell>
                            <TableCell className="text-right border-gray-200">
                              <EditOrganizationDialog
                                organization={org}
                                onSave={handleOrganizationUpdate}
                              >
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-accent"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </EditOrganizationDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              )}

              {filteredOrganizations.length === 0 && (
                <Card className="py-12 border-0 shadow-lg">
                  <CardContent className="text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No organizations found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your filters or search terms."
                        : "Get started by adding your first organization."}
                    </p>
                    {(searchQuery || statusFilter !== "all") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
