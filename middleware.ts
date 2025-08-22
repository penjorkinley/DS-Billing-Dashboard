// middleware.ts (in root directory)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is authenticated (you can modify this logic)
  const isAuthenticated = request.cookies.get("auth-token")?.value;

  // If user is authenticated and trying to access landing page, redirect to dashboard
  if (pathname === "/" && isAuthenticated) {
    // Determine user role and redirect accordingly
    const userRole = request.cookies.get("user-role")?.value;

    if (userRole === "SUPER_ADMIN") {
      return NextResponse.redirect(
        new URL("/dashboard/super-admin", request.url)
      );
    } else if (userRole === "ORGANIZATION_ADMIN") {
      return NextResponse.redirect(
        new URL("/dashboard/organization", request.url)
      );
    }
  }

  // Allow access to landing page for unauthenticated users
  if (pathname === "/" && !isAuthenticated) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
