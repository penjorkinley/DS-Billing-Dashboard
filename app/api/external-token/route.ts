// app/api/external-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";
import { externalTokenService } from "@/lib/external-token-service";

// POST /api/external-token - Generate external API token
export async function POST(request: NextRequest) {
  try {
    // Verify internal authentication and check for Super Admin role
    const internalToken = request.cookies.get("token")?.value;

    if (!internalToken) {
      return NextResponse.json(
        { success: false, message: "Internal authentication required" },
        { status: 401 }
      );
    }

    const payload = await AuthService.validateSession(internalToken);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired internal token" },
        { status: 401 }
      );
    }

    // Check if user is Super Admin
    if (payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient permissions. Super Admin role required.",
        },
        { status: 403 }
      );
    }

    // Generate external token for this user
    const externalToken = await externalTokenService.getValidToken(
      payload.userid
    );

    return NextResponse.json({
      success: true,
      message: "External token generated successfully",
      data: {
        hasValidToken: true,
        tokenInfo: externalTokenService.getTokenInfo(payload.userid),
      },
    });
  } catch (error) {
    console.error("External token generation error:", error);

    if (
      error instanceof Error &&
      error.message.includes("credentials not configured")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "External API configuration error. Please contact administrator.",
        },
        { status: 500 }
      );
    }

    if (
      error instanceof Error &&
      error.message.includes("Failed to generate external token")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to connect to external authentication service",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/external-token - Check external token status
export async function GET(request: NextRequest) {
  try {
    // Verify internal authentication
    const internalToken = request.cookies.get("token")?.value;

    if (!internalToken) {
      return NextResponse.json(
        { success: false, message: "Internal authentication required" },
        { status: 401 }
      );
    }

    const payload = await AuthService.validateSession(internalToken);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired internal token" },
        { status: 401 }
      );
    }

    // Check if user is Super Admin
    if (payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Check token status
    const hasValidToken = externalTokenService.hasValidToken(payload.userid);
    const tokenInfo = externalTokenService.getTokenInfo(payload.userid);

    return NextResponse.json({
      success: true,
      data: {
        hasValidToken,
        tokenInfo: tokenInfo
          ? {
              expiresAt: tokenInfo.expiresAt,
              createdAt: tokenInfo.createdAt,
              isExpiring: tokenInfo.expiresAt - Date.now() < 10 * 60 * 1000, // Less than 10 minutes
            }
          : null,
      },
    });
  } catch (error) {
    console.error("External token status error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/external-token - Clear external token
export async function DELETE(request: NextRequest) {
  try {
    // Verify internal authentication
    const internalToken = request.cookies.get("token")?.value;

    if (!internalToken) {
      return NextResponse.json(
        { success: false, message: "Internal authentication required" },
        { status: 401 }
      );
    }

    const payload = await AuthService.validateSession(internalToken);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired internal token" },
        { status: 401 }
      );
    }

    // Clear external token
    externalTokenService.clearToken(payload.userid);

    return NextResponse.json({
      success: true,
      message: "External token cleared successfully",
    });
  } catch (error) {
    console.error("Clear external token error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
