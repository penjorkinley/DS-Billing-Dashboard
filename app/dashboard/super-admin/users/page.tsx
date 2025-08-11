"use client";

import { useState, useMemo, useEffect } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Users,
  Shield,
  Building2,
  Edit,
  Trash2,
  Loader2,
  UserPlus,
} from "lucide-react";

// Import user management components and types
import { EditUserDialog } from "@/components/user/edit-user-dialog";
import {
  type User,
  type EditUserData,
  ROLE_DISPLAY_MAP,
  ROLES,
} from "@/lib/schemas/user";

export default function AllUsersPage() {
  const { user, loading, error, isAuthenticated } = useAuth({
    requiredRole: "SUPER_ADMIN",
  });
  const router = useRouter();
  const { showToast } = useToast();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [users, setUsers] = useState<User[]>([]);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await fetch("/api/users", {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
      } else {
        showToast({
          type: "error",
          title: "Failed to Load Users",
          message: result.message || "Could not fetch users data.",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast({
        type: "error",
        title: "Connection Error",
        message: "Failed to connect to the server.",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUsers();
    }
  }, [isAuthenticated, user]);

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

  // Handle user update
  const handleUserUpdate = async (
    userId: number,
    updatedData: EditUserData
  ) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? result.data : u))
        );

        showToast({
          type: "success",
          title: "User Updated",
          message: `User ${updatedData.userid} has been successfully updated.`,
          duration: 3000,
        });
      } else {
        showToast({
          type: "error",
          title: "Update Failed",
          message: result.message || "Failed to update user.",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showToast({
        type: "error",
        title: "Connection Error",
        message: "Failed to connect to the server.",
      });
    }
  };

  // Handle user deletion
  const handleUserDelete = async (userId: number) => {
    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) return;

    setDeletingUserId(userId);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setUsers((prev) => prev.filter((u) => u.id !== userId));

        showToast({
          type: "success",
          title: "User Deleted",
          message: `User ${userToDelete.userid} has been successfully deleted.`,
          duration: 3000,
        });
      } else {
        showToast({
          type: "error",
          title: "Delete Failed",
          message: result.message || "Failed to delete user.",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast({
        type: "error",
        title: "Connection Error",
        message: "Failed to connect to the server.",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.userid
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = users.length;
    const superAdmins = users.filter(
      (user) => user.role === ROLES.SUPER_ADMIN
    ).length;
    const orgAdmins = users.filter(
      (user) => user.role === ROLES.ORGANIZATION_ADMIN
    ).length;

    return { total, superAdmins, orgAdmins };
  }, [users]);

  // Loading state
  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
          <span className="text-muted-foreground">
            {loading ? "Verifying authentication..." : "Loading users..."}
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
              title: "User Management",
              href: "/dashboard/super-admin/users",
            },
            { title: "All Users" },
          ]}
        />

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-6 py-6">
            {/* Header Section */}
            <div className="px-4 lg:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    All Users
                  </h1>
                  <p className="text-muted-foreground">
                    Manage user accounts and their access permissions
                  </p>
                </div>
                <Button
                  className="w-fit bg-green-600 hover:bg-green-700 text-white border-0"
                  onClick={() =>
                    router.push("/dashboard/super-admin/users/create")
                  }
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="px-4 lg:px-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-800">
                      Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900">
                      {stats.total}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-800">
                      Super Administrators
                    </CardTitle>
                    <Shield className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-900">
                      {stats.superAdmins}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-0 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-800">
                      Organization Admins
                    </CardTitle>
                    <Building2 className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900">
                      {stats.orgAdmins}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Filters and Table */}
            <div className="px-4 lg:px-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 gap-4">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 border-gray-200"
                        />
                      </div>

                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value={ROLES.SUPER_ADMIN}>
                            Super Admin
                          </SelectItem>
                          <SelectItem value={ROLES.ORGANIZATION_ADMIN}>
                            Organization Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(searchQuery || roleFilter !== "all") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setRoleFilter("all");
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-6">
                  <div className="mb-4 text-sm text-muted-foreground">
                    Showing {filteredUsers.length} of {users.length} users
                  </div>

                  <div className="rounded-md border border-gray-200">
                    <Table className="border-gray-200">
                      <TableHeader>
                        <TableRow className="border-gray-200">
                          <TableHead>User ID</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Organization ID</TableHead>
                          <TableHead>Created Date</TableHead>
                          <TableHead>Updated Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            className="group border-gray-200"
                          >
                            <TableCell className="border-gray-200">
                              <div className="font-medium">{user.userid}</div>
                            </TableCell>
                            <TableCell className="border-gray-200">
                              <Badge
                                variant={
                                  user.role === ROLES.SUPER_ADMIN
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  user.role === ROLES.SUPER_ADMIN
                                    ? "bg-purple-100 text-purple-800 hover:bg-purple-100 border-0"
                                    : "bg-blue-100 text-blue-800 hover:bg-blue-100 border-0"
                                }
                              >
                                {user.role === ROLES.SUPER_ADMIN ? (
                                  <>
                                    <Shield className="h-3 w-3 mr-1" />
                                    {ROLE_DISPLAY_MAP[user.role]}
                                  </>
                                ) : (
                                  <>
                                    <Building2 className="h-3 w-3 mr-1" />
                                    {ROLE_DISPLAY_MAP[user.role]}
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="border-gray-200">
                              <div className="text-sm font-mono">
                                {user.orgId || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground border-gray-200">
                              {new Date(user.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground border-gray-200">
                              {new Date(user.updatedAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </TableCell>
                            <TableCell className="text-right border-gray-200">
                              <div className="flex items-center justify-end gap-2">
                                {/* Edit Button */}
                                <EditUserDialog
                                  user={user}
                                  onSave={handleUserUpdate}
                                >
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-blue-50"
                                  >
                                    <Edit className="h-4 w-4 text-blue-600" />
                                  </Button>
                                </EditUserDialog>

                                {/* Delete Button */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0 hover:bg-red-50"
                                      disabled={deletingUserId === user.id}
                                    >
                                      {deletingUserId === user.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                                      ) : (
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete User Account
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete the user
                                        account "{user.userid}"? This action
                                        cannot be undone and will permanently
                                        remove all associated data.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleUserDelete(user.id)
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                      >
                                        Delete User
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {filteredUsers.length === 0 && (
                      <div className="py-12 text-center">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No users found
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery || roleFilter !== "all"
                            ? "Try adjusting your filters or search terms."
                            : "Get started by adding your first user."}
                        </p>
                        {(searchQuery || roleFilter !== "all") && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSearchQuery("");
                              setRoleFilter("all");
                            }}
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
