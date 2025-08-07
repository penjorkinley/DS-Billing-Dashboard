import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const payload = await AuthService.validateSession(token);

    if (!payload) {
      // Clear invalid token
      const response = NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
      response.cookies.delete("token");
      return response;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: payload.id,
        userid: payload.userid,
        role: payload.role,
        orgId: payload.orgId,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { success: false, message: "Token verification failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const result = await AuthService.refreshToken(token);

    if (!result.success) {
      const response = NextResponse.json(result, { status: 401 });
      response.cookies.delete("token");
      return response;
    }

    const response = NextResponse.json(result);

    // Set new token cookie
    response.cookies.set("token", result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { success: false, message: "Token refresh failed" },
      { status: 500 }
    );
  }
}
