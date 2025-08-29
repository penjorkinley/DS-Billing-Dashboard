// app/api/users/route.ts - Updated to handle email field
import { AuthService } from "@/lib/auth";
import { db } from "@/lib/db";
import { createUserSchema } from "@/lib/schemas/user";
import { NextRequest, NextResponse } from "next/server";

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and check for Super Admin role
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const payload = await AuthService.validateSession(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
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

    // Get all users from database
    const users = await db.user.findMany({
      select: {
        id: true,
        userid: true,
        email: true, // NEW: Include email
        role: true,
        orgId: true,
        isFirstLogin: true, // NEW: Include first login status
        passwordChangedAt: true, // NEW: Include password change date
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    // Verify authentication and check for Super Admin role
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const payload = await AuthService.validateSession(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
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

    // Parse and validate request body
    const body = await request.json();

    // Validate the input data
    const validationResult = createUserSchema.safeParse(body);

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

    const { userid, email, password, role, orgId } = validationResult.data;

    // Check if user already exists (userid)
    const existingUser = await db.user.findUnique({
      where: { userid },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User ID already exists" },
        { status: 409 }
      );
    }

    // Check if email already exists                      // NEW: Email uniqueness check
    const existingEmail = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    // Create the user using AuthService (now with email)
    const result = await AuthService.createUser(
      userid,
      email, // NEW: Pass email to createUser
      password,
      role,
      role === "SUPER_ADMIN" ? null : orgId
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // Return success response (password is already excluded from the user object)
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: result.user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
