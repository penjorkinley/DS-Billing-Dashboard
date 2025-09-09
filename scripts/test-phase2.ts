// scripts/test-phase2.ts
import { AuthService } from "../lib/auth";
import { db } from "../lib/db";

async function testPhase2() {
  try {
    console.log("🧪 Testing Phase 2: First Login Password Change Flow...");

    // Test 1: Create an Organization Admin with isFirstLogin=true
    console.log("\n📝 Test 1: Creating Organization Admin (first login)...");
    const createResult = await AuthService.createUser(
      "test_phase2_user",
      "phase2test@organization.bt",
      "TempPassword123!",
      "ORGANIZATION_ADMIN",
      "ORG_PHASE2_TEST"
    );

    if (!createResult.success) {
      console.log("❌ User creation failed:", createResult.message);
      return;
    }

    console.log("✅ Organization Admin created successfully:");
    console.log("   User ID:", createResult.user?.userid);
    console.log("   Email:", createResult.user?.email);
    console.log("   Role:", createResult.user?.role);
    console.log("   First Login:", createResult.user?.isFirstLogin);

    // Verify user was created with isFirstLogin=true
    if (!createResult.user?.isFirstLogin) {
      console.log("❌ ERROR: User should have isFirstLogin=true");
      return;
    }

    // Test 2: Test regular authentication (should include isFirstLogin field)
    console.log(
      "\n📝 Test 2: Testing authentication response includes isFirstLogin..."
    );
    const authResult = await AuthService.authenticateUser(
      "test_phase2_user",
      "TempPassword123!"
    );

    if (!authResult.success) {
      console.log("❌ Authentication failed:", authResult.message);
      return;
    }

    console.log("✅ Authentication successful with fields:");
    console.log("   User ID:", authResult.user?.userid);
    console.log("   Email:", authResult.user?.email);
    console.log("   Role:", authResult.user?.role);
    console.log("   First Login:", authResult.user?.isFirstLogin);

    if (!authResult.user?.isFirstLogin) {
      console.log("❌ ERROR: Authentication should return isFirstLogin=true");
      return;
    }

    // Test 3: Test the new first login password change API endpoint
    console.log("\n📝 Test 3: Testing first login password change API...");

    // First, simulate a login to get a token (we'll create a simplified test)
    // In real usage, this would be done through the login endpoint with cookies

    const passwordChangeResult = await AuthService.changePasswordFirstLogin(
      "test_phase2_user",
      "TempPassword123!",
      "NewSecurePassword456!"
    );

    if (!passwordChangeResult.success) {
      console.log("❌ Password change failed:", passwordChangeResult.message);
      return;
    }

    console.log("✅ Password change successful via AuthService");

    // Test 4: Verify isFirstLogin was set to false after password change
    console.log("\n📝 Test 4: Verifying isFirstLogin was set to false...");

    const userAfterPasswordChange = await db.user.findUnique({
      where: { userid: "test_phase2_user" },
      select: {
        userid: true,
        email: true,
        isFirstLogin: true,
        passwordChangedAt: true,
      },
    });

    if (!userAfterPasswordChange) {
      console.log("❌ ERROR: User not found after password change");
      return;
    }

    console.log("✅ User status after password change:");
    console.log("   User ID:", userAfterPasswordChange.userid);
    console.log("   Email:", userAfterPasswordChange.email);
    console.log("   First Login:", userAfterPasswordChange.isFirstLogin);
    console.log(
      "   Password Changed At:",
      userAfterPasswordChange.passwordChangedAt
    );

    if (userAfterPasswordChange.isFirstLogin) {
      console.log(
        "❌ ERROR: isFirstLogin should be false after password change"
      );
      return;
    }

    if (!userAfterPasswordChange.passwordChangedAt) {
      console.log("❌ ERROR: passwordChangedAt should be set");
      return;
    }

    // Test 5: Test authentication with new password
    console.log("\n📝 Test 5: Testing authentication with new password...");

    const newAuthResult = await AuthService.authenticateUser(
      "test_phase2_user",
      "NewSecurePassword456!"
    );

    if (!newAuthResult.success) {
      console.log(
        "❌ Authentication with new password failed:",
        newAuthResult.message
      );
      return;
    }

    console.log("✅ Authentication with new password successful:");
    console.log("   First Login Status:", newAuthResult.user?.isFirstLogin);

    if (newAuthResult.user?.isFirstLogin) {
      console.log(
        "❌ ERROR: isFirstLogin should be false after successful password change"
      );
      return;
    }

    // Test 6: Test that old password no longer works
    console.log("\n📝 Test 6: Verifying old password no longer works...");

    const oldPasswordResult = await AuthService.authenticateUser(
      "test_phase2_user",
      "TempPassword123!" // Old password
    );

    if (oldPasswordResult.success) {
      console.log("❌ ERROR: Old password should not work after change");
      return;
    }

    console.log(
      "✅ Old password correctly rejected:",
      oldPasswordResult.message
    );

    // Test 7: Test first login password change with wrong current password
    console.log(
      "\n📝 Test 7: Testing first login password change with wrong password..."
    );

    // Create another test user for this test
    const testUser2 = await AuthService.createUser(
      "test_phase2_user2",
      "phase2test2@organization.bt",
      "TempPassword789!",
      "ORGANIZATION_ADMIN",
      "ORG_PHASE2_TEST2"
    );

    if (testUser2.success) {
      const wrongPasswordResult = await AuthService.changePasswordFirstLogin(
        "test_phase2_user2",
        "WrongCurrentPassword!", // Wrong current password
        "NewPassword123!"
      );

      if (wrongPasswordResult.success) {
        console.log(
          "❌ ERROR: Password change should fail with wrong current password"
        );
      } else {
        console.log(
          "✅ Password change correctly rejected with wrong current password:",
          wrongPasswordResult.message
        );
      }
    }

    // Cleanup: Remove test users
    console.log("\n🧹 Cleaning up test users...");

    await db.user.deleteMany({
      where: {
        userid: {
          in: ["test_phase2_user", "test_phase2_user2"],
        },
      },
    });

    console.log("✅ Test users cleaned up");

    console.log("\n🎉 Phase 2 testing completed successfully!");
    console.log("\n📋 What's working:");
    console.log("   ✅ Organization Admin creation with isFirstLogin=true");
    console.log("   ✅ Authentication returns isFirstLogin field");
    console.log("   ✅ First login password change functionality");
    console.log("   ✅ isFirstLogin set to false after password change");
    console.log("   ✅ passwordChangedAt timestamp recorded");
    console.log("   ✅ New password authentication works");
    console.log("   ✅ Old password is invalidated");
    console.log("   ✅ Security validation (wrong password rejected)");

    console.log("\n🚀 Ready for Phase 2 UI Testing:");
    console.log("   1. Create an Organization Admin user");
    console.log("   2. Try to login - should trigger first login modal");
    console.log("   3. Change password in modal");
    console.log("   4. Should redirect to dashboard after success");
  } catch (error) {
    console.error("❌ Phase 2 test failed:", error);
  } finally {
    await db.$disconnect();
  }
}

// Run the test
console.log("🚀 Starting Phase 2 test...");
testPhase2();
