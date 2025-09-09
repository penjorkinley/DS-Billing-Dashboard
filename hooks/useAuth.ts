// hooks/useAuth.ts - Updated to support first login detection and routing
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: number;
  userid: string;
  email: string; // NEW: Include email
  role: string;
  orgId: string | null;
  isFirstLogin: boolean; // NEW: Include first login status
}

interface UseAuthOptions {
  requiredRole?: string;
  redirectTo?: string;
  allowFirstLogin?: boolean; // NEW: Allow first login users to access certain pages
}

export function useAuth(options: UseAuthOptions = {}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function verifyAuth() {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (!mounted) return;

        if (!result.success) {
          setError(result.message);
          router.push(options.redirectTo || "/login");
          return;
        }

        // UPDATED: Check role requirement with new user structure
        if (options.requiredRole && result.user.role !== options.requiredRole) {
          setError("Insufficient permissions");

          // Redirect based on actual role
          const redirectMap: Record<string, string> = {
            SUPER_ADMIN: "/dashboard/super-admin",
            ORGANIZATION_ADMIN: "/dashboard/organization",
          };

          const correctPath = redirectMap[result.user.role] || "/login";
          router.push(correctPath);
          return;
        }

        // NEW: Check for first login users who shouldn't access protected pages
        // Organization Admins with isFirstLogin=true should be redirected to login page
        // to complete the first login flow (password change + subscription setup)
        if (
          result.user.isFirstLogin &&
          result.user.role === "ORGANIZATION_ADMIN" &&
          !options.allowFirstLogin
        ) {
          console.log(
            `First login user ${result.user.userid} attempted to access protected route, redirecting to login`
          );
          setError("Please complete your account setup");
          router.push("/login");
          return;
        }

        // Set user with all fields including new ones
        setUser({
          id: result.user.id,
          userid: result.user.userid,
          email: result.user.email,
          role: result.user.role,
          orgId: result.user.orgId,
          isFirstLogin: result.user.isFirstLogin,
        });
        setError(null);
      } catch (err) {
        if (!mounted) return;
        console.error("Auth verification error:", err);
        setError("Authentication check failed");
        router.push(options.redirectTo || "/login");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    verifyAuth();

    return () => {
      mounted = false;
    };
  }, [
    router,
    options.requiredRole,
    options.redirectTo,
    options.allowFirstLogin,
  ]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if logout API fails
      router.push("/login");
      router.refresh();
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        // UPDATED: Set user with all fields
        setUser({
          id: result.user.id,
          userid: result.user.userid,
          email: result.user.email,
          role: result.user.role,
          orgId: result.user.orgId,
          isFirstLogin: result.user.isFirstLogin,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    logout,
    refreshToken,
    isAuthenticated: !!user,
    // NEW: Helper methods for first login detection
    isFirstLogin: user?.isFirstLogin ?? false,
    requiresPasswordChange:
      user?.isFirstLogin && user?.role === "ORGANIZATION_ADMIN",
  };
}
