// app/api/auth/change-password-first-login/route.ts
import { AuthService } from "@/lib/auth";
import { firstLoginPasswordChangeSchema } from "@/lib/schemas/user";
import { NextRequest, NextResponse } from "next/server";

// Helper function to get client IP for security logging
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const clientIP = request.headers.get("x-client-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (clientIP) {
    return clientIP;
  }
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    console.log(`First login password change attempt from IP: ${clientIP}`);

    // 1. Verify authentication - user must be logged in to change password
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = await AuthService.validateSession(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validationResult = firstLoginPasswordChangeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = validationResult.data;

    // 3. Security: Ensure this is only for Organization Admins (first login users)
    // Super Admins should not use this endpoint as they don't have isFirstLogin = true
    if (payload.role !== "ORGANIZATION_ADMIN") {
      console.warn(
        `Unauthorized first login password change attempt by ${payload.userid} (${payload.role}) from IP: ${clientIP}`
      );
      return NextResponse.json(
        {
          success: false,
          message:
            "This endpoint is only for Organization Administrators during first login",
        },
        { status: 403 }
      );
    }

    // 4. Call the existing AuthService method (already implemented and tested)
    const result = await AuthService.changePasswordFirstLogin(
      payload.userid,
      currentPassword,
      newPassword
    );

    if (!result.success) {
      // Log failed attempt for security monitoring
      console.warn(
        `Failed first login password change for ${payload.userid} from IP: ${clientIP}: ${result.message}`
      );
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // 5. Success - Log for security audit
    console.log(
      `✅ First login password changed successfully for ${payload.userid} from IP: ${clientIP}`
    );

    // 6. Return success response
    return NextResponse.json({
      success: true,
      message:
        "Password changed successfully. You can now proceed to setup your subscription.",
    });
  } catch (error) {
    console.error("First login password change error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
