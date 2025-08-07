import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";
import { validateCredentials } from "@/lib/validation";

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

    // Use improved AuthService with client identifier for rate limiting
    const result = await AuthService.authenticateUser(
      userid,
      password,
      clientIP
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.message.includes("Too many") ? 429 : 401 }
      );
    }

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

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
