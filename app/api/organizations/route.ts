// app/api/organizations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";
import { createOrganizationSchema } from "@/lib/schemas/organization";
import {
  makeExternalApiCall,
  handleExternalApiError,
  type ExternalApiResponse,
  type CreateOrganizationApiResponse,
} from "@/lib/api-config";

// POST /api/organizations - Create new organization
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
    const validationResult = createOrganizationSchema.safeParse(body);

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
      createdBy,
    };

    // Call the external API using our utility (automatically handles token generation)
    const { data: externalApiData, response: externalApiResponse } =
      await makeExternalApiCall<CreateOrganizationApiResponse>(
        "/create-organization",
        {
          method: "POST",
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
            "Failed to create organization in external system",
        },
        { status: externalApiResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Organization created successfully",
      data: externalApiData,
    });
  } catch (error) {
    console.error("Create organization error:", error);

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

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
