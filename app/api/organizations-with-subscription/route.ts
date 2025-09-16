// app/api/organizations-with-subscription/route.ts
import {
  handleExternalApiError,
  makeExternalApiCall,
  type ExternalApiResponse,
} from "@/lib/api-config";
import { AuthService } from "@/lib/auth";
import { orgWithSubscriptionSchema } from "@/lib/schemas/subscription";
import { NextRequest, NextResponse } from "next/server";

// Define the expected API response structure
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

// POST /api/organizations-with-subscription - Create organization and simulate subscription
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

    // Validate the combined input data
    const validationResult = orgWithSubscriptionSchema.safeParse(body);

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

    const {
      name,
      webhookId,
      webhookUrl,
      status,
      createdBy,
      subscriptionType,
      signaturePlan,
      verificationPlan,
      contractPeriodMonths,
      notes,
    } = validationResult.data;

    console.log("📋 Creating organization with subscription:", {
      orgName: name,
      subscriptionType,
      signaturePlan,
      verificationPlan,
      contractPeriodMonths,
    });

    // STEP 1: Create Organization using external API
    console.log("🏢 Step 1: Creating organization...");

    const orgApiPayload = {
      name,
      webhookId,
      webhookUrl,
      status,
      createdBy,
    };

    const { data: orgApiData, response: orgApiResponse } =
      await makeExternalApiCall<OrganizationApiResponse>(
        "/create-organization",
        {
          method: "POST",
          body: JSON.stringify(orgApiPayload),
        },
        payload.userid
      );

    if (!orgApiResponse.ok) {
      console.error("❌ Organization creation failed:", orgApiData);
      return NextResponse.json(
        {
          success: false,
          message:
            (orgApiData as ExternalApiResponse).message ||
            (orgApiData as ExternalApiResponse).error ||
            "Failed to create organization in external system",
          step: "organization_creation",
        },
        { status: orgApiResponse.status }
      );
    }

    console.log("✅ Organization created successfully:", orgApiData);

    // Fetch the newly created organization details to get the orgId
    console.log("🔍 Fetching organization details...");
    const { data: orgList, response: orgListResponse } =
      await makeExternalApiCall<any[]>(
        "/get-all-organization",
        {
          method: "GET",
        },
        payload.userid
      );

    if (!orgListResponse.ok) {
      console.error("❌ Failed to fetch organization details:", orgList);
      return NextResponse.json(
        {
          success: false,
          message: "Organization created but failed to fetch its details",
          step: "organization_details_fetch",
        },
        { status: 500 }
      );
    }

    // Find the newly created organization by name
    const newOrg = orgList.find((org) => org.name === name);

    if (!newOrg || !newOrg.orgId) {
      console.error("❌ Could not find newly created organization in the list");
      return NextResponse.json(
        {
          success: false,
          message: "Organization created but could not find its details",
          step: "organization_details_fetch",
        },
        { status: 500 }
      );
    }

    const orgId = newOrg.orgId;

    console.log("✅ Extracted orgId:", orgId);

    // STEP 2: Simulate Subscription Creation (NO REAL API CALL)
    console.log("💳 Step 2: Simulating subscription for orgId:", orgId);

    // Generate simulated subscription response
    const simulatedSubscriptionResponse = {
      success: true,
      subscriptionId: `SUB_${orgId}_${Date.now()}`,
      orgId: orgId,
      subscriptionType: subscriptionType,
      signaturePlan: signaturePlan,
      verificationPlan: verificationPlan,
      contractPeriodMonths: contractPeriodMonths,
      status: "ACTIVE",
      message: "Subscription simulated successfully",
      createdAt: new Date().toISOString(),
      notes: notes,
    };

    console.log(
      "✅ Subscription simulated successfully:",
      simulatedSubscriptionResponse
    );

    // SUCCESS - Organization created, subscription simulated
    return NextResponse.json({
      success: true,
      message: "Organization and subscription created successfully",
      data: {
        organization: orgApiData,
        subscription: simulatedSubscriptionResponse,
        orgId: orgId,
        subscriptionId: simulatedSubscriptionResponse.subscriptionId,
      },
    });
  } catch (error) {
    console.error("💥 Organization with subscription creation error:", error);

    const errorMessage = handleExternalApiError(error);
    const statusCode = errorMessage.includes("connect to external service")
      ? 503
      : 500;

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        step: "unknown",
      },
      { status: statusCode }
    );
  }
}

// GET method for testing/health check
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Organization with subscription API is available",
    endpoints: {
      POST: "Create organization with simulated subscription",
    },
  });
}
