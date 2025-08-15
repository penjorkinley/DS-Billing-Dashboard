// app/api/organizations/[orgId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";
import { updateOrganizationApiSchema } from "@/lib/schemas/organization";
import {
  makeExternalApiCall,
  handleExternalApiError,
  type ExternalApiResponse,
  type CreateOrganizationApiResponse,
} from "@/lib/api-config";

// PUT /api/organizations/[orgId] - Update organization by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
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

    // Get orgId from URL params
    const { orgId } = await params;

    if (!orgId) {
      return NextResponse.json(
        { success: false, message: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();

    // Validate the input data using the update schema
    const validationResult = updateOrganizationApiSchema.safeParse(body);

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

    const { name, webhookId, webhookUrl, status, createdBy } =
      validationResult.data;

    // Prepare the request body for external API
    const externalApiPayload = {
      name,
      webhookId,
      webhookUrl,
      status,
      createdBy, // You might want to change this to updatedBy
    };

    // Call the external API using your existing utility
    const { data: externalApiData, response: externalApiResponse } =
      await makeExternalApiCall<CreateOrganizationApiResponse>(
        `/organization/${orgId}`, // This matches your external API endpoint
        {
          method: "PUT",
          body: JSON.stringify(externalApiPayload),
        },
        payload.userid // Pass userId for token management
      );

    if (!externalApiResponse.ok) {
      console.error("External API error:", externalApiData);
      return NextResponse.json(
        {
          success: false,
          message:
            (externalApiData as ExternalApiResponse).message ||
            (externalApiData as ExternalApiResponse).error ||
            "Failed to update organization in external system",
        },
        { status: externalApiResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Organization updated successfully",
      data: externalApiData,
    });
  } catch (error) {
    console.error("Update organization error:", error);

    const errorMessage = handleExternalApiError(error);
    const statusCode = errorMessage.includes("connect to external service")
      ? 503
      : 500;

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
