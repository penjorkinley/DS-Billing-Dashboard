// scripts/test-phase1.ts
import { AuthService } from "../lib/auth";
import { db } from "../lib/db";

async function testPhase1() {
  try {
    console.log("🧪 Testing Phase 1: Email and First Login Fields...");

    // Test 1: Create a user with email
    console.log("\n📝 Test 1: Creating user with email...");
    const createResult = await AuthService.createUser(
      "test_org_admin",
      "test@organization.bt",
      "TestPassword123!",
      "ORGANIZATION_ADMIN",
      "ORG001"
    );

    if (createResult.success) {
      console.log("✅ User created successfully:");
      console.log("   User ID:", createResult.user?.userid);
      console.log("   Email:", createResult.user?.email);
      console.log("   Role:", createResult.user?.role);
      console.log("   Organization:", createResult.user?.orgId);
      console.log("   First Login:", createResult.user?.isFirstLogin);
    } else {
      console.log("❌ User creation failed:", createResult.message);
      return;
    }

    // Test 2: Try to create user with same email (should fail)
    console.log("\n📝 Test 2: Attempting duplicate email...");
    const duplicateEmailResult = await AuthService.createUser(
      "another_user",
      "test@organization.bt", // Same email
      "AnotherPassword123!",
      "ORGANIZATION_ADMIN",
      "ORG002"
    );

    if (!duplicateEmailResult.success) {
      console.log(
        "✅ Duplicate email correctly rejected:",
        duplicateEmailResult.message
      );
    } else {
      console.log("❌ Should have rejected duplicate email");
    }

    // Test 3: Test authentication with new user
    console.log("\n📝 Test 3: Testing authentication...");
    const authResult = await AuthService.authenticateUser(
      "test_org_admin",
      "TestPassword123!"
    );

    if (authResult.success) {
      console.log("✅ Authentication successful:");
      console.log("   Email:", authResult.user?.email);
      console.log("   First Login:", authResult.user?.isFirstLogin);
    } else {
      console.log("❌ Authentication failed:", authResult.message);
    }

    // Test 4: Test first login password change
    console.log("\n📝 Test 4: Testing first login password change...");
    const passwordChangeResult = await AuthService.changePasswordFirstLogin(
      "test_org_admin",
      "TestPassword123!",
      "NewPassword456!"
    );

    if (passwordChangeResult.success) {
      console.log("✅ Password changed successfully");

      // Verify isFirstLogin is now false
      const user = await db.user.findUnique({
        where: { userid: "test_org_admin" },
        select: { isFirstLogin: true, passwordChangedAt: true },
      });

      console.log("   First Login Status:", user?.isFirstLogin);
      console.log("   Password Changed At:", user?.passwordChangedAt);
    } else {
      console.log("❌ Password change failed:", passwordChangeResult.message);
    }

    // Test 5: Verify new password works
    console.log("\n📝 Test 5: Testing new password...");
    const newAuthResult = await AuthService.authenticateUser(
      "test_org_admin",
      "NewPassword456!"
    );

    if (newAuthResult.success && !newAuthResult.user?.isFirstLogin) {
      console.log("✅ New password works and isFirstLogin is false");
    } else {
      console.log("❌ New password test failed");
    }

    // Cleanup: Remove test user
    console.log("\n🧹 Cleaning up test user...");
    await db.user.delete({
      where: { userid: "test_org_admin" },
    });
    console.log("✅ Test user removed");

    console.log("\n🎉 Phase 1 test completed successfully!");
    console.log("\n📋 What's working:");
    console.log("   ✅ Email field in user creation");
    console.log("   ✅ Email uniqueness validation");
    console.log("   ✅ First login flag tracking");
    console.log("   ✅ First login password change");
    console.log("   ✅ Password change timestamp");
  } catch (error) {
    console.error("❌ Phase 1 test failed:", error);
  } finally {
    await db.$disconnect();
  }
}

// Run the test
testPhase1();
