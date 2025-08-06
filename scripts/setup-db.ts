import { AuthService } from "../lib/auth";
import { db } from "../lib/db";

async function setupDatabase() {
  try {
    console.log("🔄 Setting up database...");

    // Create Super Admin (no orgId - can access all organizations)
    const superAdminResult = await AuthService.createUser(
      "superadmin",
      "SuperAdmin123!",
      "SUPER_ADMIN",
      null // Super admin doesn't belong to specific organization
    );

    if (superAdminResult.success) {
      console.log("✅ Super Admin created successfully");
      console.log("   User ID: superadmin");
      console.log("   Password: SuperAdmin123!");
      console.log("   Organization: ALL (Super Admin)");
    } else {
      console.log("⚠️  Super Admin creation:", superAdminResult.message);
    }

    // Create Organization Admin for ORG001
    const orgAdmin1Result = await AuthService.createUser(
      "orgadmin1",
      "OrgAdmin123!",
      "ORGANIZATION_ADMIN",
      "ORG001"
    );

    if (orgAdmin1Result.success) {
      console.log("✅ Organization Admin (ORG001) created successfully");
      console.log("   User ID: orgadmin1");
      console.log("   Password: OrgAdmin123!");
      console.log("   Organization: ORG001");
    } else {
      console.log(
        "⚠️  Organization Admin (ORG001) creation:",
        orgAdmin1Result.message
      );
    }

    // Create Organization Admin for ORG002
    const orgAdmin2Result = await AuthService.createUser(
      "orgadmin2",
      "OrgAdmin123!",
      "ORGANIZATION_ADMIN",
      "ORG002"
    );

    if (orgAdmin2Result.success) {
      console.log("✅ Organization Admin (ORG002) created successfully");
      console.log("   User ID: orgadmin2");
      console.log("   Password: OrgAdmin123!");
      console.log("   Organization: ORG002");
    } else {
      console.log(
        "⚠️  Organization Admin (ORG002) creation:",
        orgAdmin2Result.message
      );
    }

    console.log("\n🎉 Database setup completed!");
    console.log("\n📝 Login Credentials:");
    console.log(
      "Super Admin    - User ID: superadmin, Password: SuperAdmin123! (Access: ALL)"
    );
    console.log(
      "Org Admin 1    - User ID: orgadmin1, Password: OrgAdmin123! (Access: ORG001)"
    );
    console.log(
      "Org Admin 2    - User ID: orgadmin2, Password: OrgAdmin123! (Access: ORG002)"
    );
  } catch (error) {
    console.error("❌ Database setup failed:", error);
  } finally {
    await db.$disconnect();
  }
}

// Run the setup
setupDatabase();
