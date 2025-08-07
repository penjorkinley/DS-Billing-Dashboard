"use client";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/lib/toast-context";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LogOut,
  Users,
  CreditCard,
  FileText,
  BarChart3,
  UserPlus,
  Building2,
  Bell,
  Loader2,
} from "lucide-react";

export default function OrganizationAdminDashboard() {
  const { user, loading, error, logout, isAuthenticated } = useAuth({
    requiredRole: "ORGANIZATION_ADMIN",
  });
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast({
        type: "success",
        title: "Logged Out",
        message: "You have been successfully logged out. Redirecting...",
        duration: 2000,
      });
    } catch (error) {
      console.error("Logout error:", error);
      showToast({
        type: "error",
        title: "Connection Error",
        message: "Failed to logout properly. Redirecting anyway...",
      });
    }
  };

  // Show loading state
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

  // Show error state
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Bhutan NDI"
              width={100}
              height={32}
              priority
            />
            <div className="flex items-center gap-2 ml-4">
              <Building2 className="h-4 w-4 text-brand-secondary" />
              <span className="text-sm font-medium text-brand-primary">
                Organization Admin
              </span>
              <span className="text-xs text-muted-foreground">
                • {user.userid} ({user.orgId})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">
            Organization Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your organization's digital services and billing
          </p>
        </div>

        {/* Organization Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-brand-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-primary">145</div>
              <CardDescription>In your organization</CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Usage
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-brand-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-primary">
                Nu. 25,400
              </div>
              <CardDescription>Current billing cycle</CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services</CardTitle>
              <FileText className="h-4 w-4 text-brand-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-primary">12</div>
              <CardDescription>Active digital services</CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <CreditCard className="h-4 w-4 text-brand-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-primary">Nu. 0</div>
              <CardDescription>All bills paid</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-primary" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage users within your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Tenzin Wangchuk</p>
                    <p className="text-sm text-muted-foreground">
                      IT Manager • Active
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Pema Lhamo</p>
                    <p className="text-sm text-muted-foreground">
                      Developer • Active
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Karma Dorji</p>
                    <p className="text-sm text-muted-foreground">
                      Analyst • Active
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                <Button className="w-full mt-3 bg-brand-primary hover:bg-brand-primary/90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing & Services */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-brand-primary" />
                Billing & Services
              </CardTitle>
              <CardDescription>
                Monitor usage and manage service subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Digital Identity Service</p>
                    <p className="text-sm text-muted-foreground">
                      Nu. 8,500/month
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Document Verification</p>
                    <p className="text-sm text-muted-foreground">
                      Nu. 12,200/month
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">API Gateway</p>
                    <p className="text-sm text-muted-foreground">
                      Nu. 4,700/month
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <Button variant="outline" className="w-full mt-3">
                  View All Bills
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-brand-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest activities in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-shrink-0 w-2 h-2 bg-brand-secondary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">
                    Karma Dorji joined the organization • 2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Service usage updated</p>
                  <p className="text-xs text-muted-foreground">
                    API Gateway usage increased by 15% • 5 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment processed</p>
                  <p className="text-xs text-muted-foreground">
                    Monthly bill of Nu. 25,400 paid successfully • 1 day ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Control Notice for Organization Admin */}
        <Card className="mt-8 border-brand-secondary/20 bg-gradient-to-r from-brand-secondary/5 to-brand-primary/5">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-secondary/10">
                <Building2 className="h-8 w-8 text-brand-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-primary">
                  Organization Administrator Access
                </h3>
                <p className="text-muted-foreground">
                  You have administrative access to {user.orgId} organization
                  data and users
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button className="bg-brand-primary hover:bg-brand-primary/90">
                  Manage Users
                </Button>
                <Button variant="outline">View Reports</Button>
                <Button variant="outline">Billing History</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
