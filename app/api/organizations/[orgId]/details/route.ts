// app/api/organizations/[orgId]/details/route.ts
import { handleExternalApiError, makeExternalApiCall } from "@/lib/api-config";
import { AuthService } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/organizations/[orgId]/details - Fetch specific organization details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    // Verify authentication
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
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { orgId } = await params;

    // Authorization check: Users can only access their own organization data
    // unless they're SUPER_ADMIN
    if (payload.role !== "SUPER_ADMIN" && payload.orgId !== orgId) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. You can only view your organization's data.",
        },
        { status: 403 }
      );
    }

    // Call your external API endpoint
    const { data: orgData, response: externalResponse } =
      await makeExternalApiCall<OrganizationApiResponse>(
        `/organization/${orgId}`, // Your external endpoint
        { method: "GET" },
        payload.userid
      );

    if (!externalResponse.ok) {
      console.error("External API error:", orgData);
      return NextResponse.json(
        {
          success: false,
          message: orgData.message || "Failed to fetch organization details",
        },
        { status: externalResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Organization details fetched successfully",
      data: orgData.data, // Based on your API response structure
    });
  } catch (error) {
    console.error("Fetch organization details error:", error);
    const errorMessage = handleExternalApiError(error);
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

// Types for your API response (based on the example you provided)
interface OrganizationApiResponse {
  statusCode: number;
  message: string;
  data: {
    id: number;
    orgId: string;
    name: string;
    webhookId: string;
    webhookUrl: string;
    status: "ACTIVE" | "INACTIVE";
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string | null;
  };
}
