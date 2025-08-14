// app/api/organizations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";
import {
  createOrganizationSchema,
  convertToDisplayFormat,
} from "@/lib/schemas/organization";
import {
  makeExternalApiCall,
  handleExternalApiError,
  type ExternalApiResponse,
  type CreateOrganizationApiResponse,
} from "@/lib/api-config";

// GET /api/organizations - Fetch all organizations
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and check for Super Admin role
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

    // Check if user has proper permissions
    if (payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Call the external API using your existing utility function
    const { data: rawData, response: externalApiResponse } =
      await makeExternalApiCall<any[]>(
        "/get-all-organization",
        {
          method: "GET",
        },
        payload.userid // Pass userId for token management
      );

    if (!externalApiResponse.ok) {
      console.error("External API error:", rawData);
      return NextResponse.json(
        {
          success: false,
          message:
            (rawData as ExternalApiResponse).message ||
            (rawData as ExternalApiResponse).error ||
            "Failed to fetch organizations from external system",
        },
        { status: externalApiResponse.status }
      );
    }

    // Convert raw API data to display format with dummy subscription data
    const displayData = rawData.map(convertToDisplayFormat);

    return NextResponse.json({
      success: true,
      data: displayData,
      message: "Organizations fetched successfully",
    });
  } catch (error) {
    console.error("Fetch organizations error:", error);

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

// POST /api/organizations - Create new organization (YOUR EXISTING CODE)
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
