import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  userid: string;
  role: string;
  orgId: string | null;
}

interface UseAuthOptions {
  requiredRole?: string;
  redirectTo?: string;
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

        // Check role requirement
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

        setUser(result.user);
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
  }, [router, options.requiredRole, options.redirectTo]);

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
        setUser(result.user);
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
  };
}
