import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  console.log("Middleware - Path:", pathname, "Token exists:", !!token);

  // Define public routes that don't need authentication
  const publicRoutes = ["/login", "/api/auth/login", "/api/auth/logout"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Allow access to public routes
  if (isPublicRoute) {
    console.log("Public route, allowing access");
    return NextResponse.next();
  }

  // If no token exists, redirect to login
  if (!token) {
    console.log("No token, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token exists, allow access to role-specific dashboards
  console.log("Token exists, allowing access to:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
