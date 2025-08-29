// scripts/setup-db.ts - Corrected version for new schema
import { AuthService } from "../lib/auth";
import { db } from "../lib/db";

async function setupDatabase() {
  try {
    console.log("🔄 Setting up database with new schema...");

    // Create Super Admin (no orgId - can access all organizations)
    console.log("\n👤 Creating Super Admin...");
    const superAdminResult = await AuthService.createUser(
      "superadmin", // userid
      "admin@bhutanndi.bt", // email (NEW PARAMETER)
      "SuperAdmin123!", // password
      "SUPER_ADMIN", // role
      null // orgId (Super admin doesn't belong to specific organization)
    );

    if (superAdminResult.success) {
      console.log("✅ Super Admin created successfully");
      console.log("   User ID: superadmin");
      console.log("   Email: admin@bhutanndi.bt");
      console.log("   Password: SuperAdmin123!");
      console.log("   Role: SUPER_ADMIN");
      console.log("   Organization: ALL (Super Admin)");
      console.log("   First Login:", superAdminResult.user?.isFirstLogin);
      console.log("   Created At:", superAdminResult.user?.createdAt);
    } else {
      console.log("⚠️  Super Admin creation failed:", superAdminResult.message);

      // Check if user already exists
      if (superAdminResult.message.includes("already exists")) {
        console.log("ℹ️  Super Admin already exists, checking details...");

        const existingUser = await db.user.findUnique({
          where: { userid: "superadmin" },
          select: {
            userid: true,
            email: true, // Now available after prisma generate
            role: true,
            orgId: true,
            isFirstLogin: true, // Now available after prisma generate
            createdAt: true,
          },
        });

        if (existingUser) {
          console.log("📋 Existing Super Admin Details:");
          console.log("   User ID:", existingUser.userid);
          console.log("   Email:", existingUser.email);
          console.log("   Role:", existingUser.role);
          console.log("   Organization:", existingUser.orgId || "ALL");
          console.log("   First Login:", existingUser.isFirstLogin);
          console.log("   Created At:", existingUser.createdAt);
        }
      }
    }

    // Since Super Admin shouldn't go through subscription flow,
    // let's set isFirstLogin to false for them
    if (superAdminResult.success) {
      console.log(
        "\n🔧 Setting Super Admin as experienced user (not first login)..."
      );
      await db.user.update({
        where: { userid: "superadmin" },
        data: {
          isFirstLogin: false, // Super Admin doesn't need subscription flow
          passwordChangedAt: new Date(),
        },
      });
      console.log("✅ Super Admin configured for normal access");
    }

    console.log("\n🎉 Database setup completed!");
    console.log("\n📝 Login Credentials:");
    console.log(
      "Super Admin    - User ID: superadmin, Password: SuperAdmin123!"
    );
    console.log("Email          - admin@bhutanndi.bt");
    console.log("Access         - ALL organizations");
    console.log("Login URL      - http://localhost:3000/login");

    console.log("\n🔧 Next Steps:");
    console.log("1. Start your development server: npm run dev");
    console.log("2. Go to: http://localhost:3000/login");
    console.log("3. Login with superadmin / SuperAdmin123!");
    console.log("4. Go to Create Organization to test org creation");
    console.log("5. Create Organization Admin users with email addresses");
  } catch (error) {
    console.error("❌ Database setup failed:", error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  } finally {
    await db.$disconnect();
  }
}

// Run the setup
console.log("🚀 Starting database setup...");
setupDatabase();
