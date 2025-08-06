import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";
import { validateCredentials } from "@/lib/validation";

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const clientIP = request.headers.get("x-client-ip");

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (clientIP) {
    return clientIP;
  }

  // Fallback for development
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const { userid, password } = await request.json();
    const clientIP = getClientIP(request);

    // Validate input first
    const validation = validateCredentials(userid, password);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    // Rate limiting check
    const now = Date.now();
    const attempts = loginAttempts.get(clientIP);

    if (
      attempts &&
      attempts.count >= 5 &&
      now - attempts.lastAttempt < 15 * 60 * 1000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many login attempts. Please try again later.",
        },
        { status: 429 }
      );
    }

    const result = await AuthService.authenticateUser(userid, password);

    if (!result.success) {
      // Track failed attempts
      const currentAttempts = attempts || { count: 0, lastAttempt: 0 };
      loginAttempts.set(clientIP, {
        count: currentAttempts.count + 1,
        lastAttempt: now,
      });

      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    // Clear attempts on successful login
    loginAttempts.delete(clientIP);

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: result.user,
    });

    response.cookies.set("token", result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
