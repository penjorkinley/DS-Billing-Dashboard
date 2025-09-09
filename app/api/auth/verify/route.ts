// app/api/auth/verify/route.ts - Updated to include isFirstLogin and email
import { AuthService } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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

    // UPDATED: Fetch additional user data from database
    // This is safe because validateSession already confirmed the user exists
    const userDetails = await db.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        userid: true,
        email: true,
        role: true,
        orgId: true,
        isFirstLogin: true, // NEW: Include first login status
      },
    });

    if (!userDetails) {
      // This shouldn't happen if validateSession passed, but handle gracefully
      console.error(`User ${payload.id} not found despite valid session`);
      const response = NextResponse.json(
        { success: false, message: "User account no longer exists" },
        { status: 401 }
      );
      response.cookies.delete("token");
      return response;
    }

    // Return comprehensive user data
    return NextResponse.json({
      success: true,
      user: {
        id: userDetails.id,
        userid: userDetails.userid,
        email: userDetails.email, // NEW: Include email
        role: userDetails.role,
        orgId: userDetails.orgId,
        isFirstLogin: userDetails.isFirstLogin, // NEW: Include first login status
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
