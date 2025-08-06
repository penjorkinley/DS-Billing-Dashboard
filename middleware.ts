import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "./lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/api/auth/login", "/api/auth/logout"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = AuthService.verifyToken(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set("token", "", { maxAge: 0, path: "/" });
      return response;
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.id.toString());
    requestHeaders.set("x-user-userid", payload.userid);
    requestHeaders.set("x-user-role", payload.role);
    requestHeaders.set("x-user-orgid", payload.orgId || "");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    return response;
  }
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
