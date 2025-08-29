// lib/auth.ts - Updated with email support and first login handling
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

export interface JWTPayload {
  id: number;
  userid: string;
  role: string;
  orgId: string | null;
}

export interface AuthResult {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    userid: string;
    email: string; // NEW: Include email in auth result
    role: string;
    orgId: string | null;
    isFirstLogin: boolean; // NEW: Include first login status
  };
}

export interface CreateUserResult {
  success: boolean;
  message: string;
  user?: {
    id: number;
    userid: string;
    email: string; // NEW: Include email in create result
    role: string;
    orgId: string | null;
    isFirstLogin: boolean; // NEW: Include first login status
    createdAt: Date;
  };
}

// Rate limiting storage
const authAttempts = new Map<string, { count: number; resetTime: number }>();

export class AuthService {
  private static readonly MAX_AUTH_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  /** Hash password using bcrypt */
  private static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /** Compare password with hash */
  private static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /** Generate JWT token */
  private static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  }

  /** Verify JWT token */
  private static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        console.log("Invalid token:", error.message);
      } else {
        console.error("Token verification error:", error);
      }
      return null;
    }
  }

  /** Check if user is rate limited */
  private static isRateLimited(identifier: string): boolean {
    const attempts = authAttempts.get(identifier);
    if (!attempts) return false;

    const now = Date.now();
    if (now > attempts.resetTime) {
      authAttempts.delete(identifier);
      return false;
    }

    return attempts.count >= this.MAX_AUTH_ATTEMPTS;
  }

  /** Record failed authentication attempt */
  private static recordFailedAttempt(identifier: string): void {
    const now = Date.now();
    const attempts = authAttempts.get(identifier);

    if (!attempts || now > attempts.resetTime) {
      authAttempts.set(identifier, {
        count: 1,
        resetTime: now + this.LOCKOUT_DURATION,
      });
    } else {
      attempts.count += 1;
    }
  }

  /** Clear successful authentication attempts */
  private static clearFailedAttempts(identifier: string): void {
    authAttempts.delete(identifier);
  }

  /** Authenticate a user and return a JWT on success */
  static async authenticateUser(
    userid: string,
    password: string,
    clientIdentifier?: string
  ): Promise<AuthResult> {
    try {
      // Input validation
      if (!userid?.trim() || !password) {
        return { success: false, message: "Invalid credentials provided" };
      }

      // Rate limiting check
      const identifier = clientIdentifier || userid;
      if (this.isRateLimited(identifier)) {
        return {
          success: false,
          message: "Too many failed attempts. Please try again later.",
        };
      }

      // Find user with all needed fields
      const user = await db.user.findUnique({
        where: { userid: userid.trim() },
        select: {
          id: true,
          userid: true,
          email: true, // NEW: Include email
          password: true,
          role: true,
          orgId: true,
          isFirstLogin: true, // NEW: Include first login status
        },
      });

      if (!user) {
        this.recordFailedAttempt(identifier);
        return { success: false, message: "Invalid credentials" };
      }

      // Verify password
      const valid = await this.comparePassword(password, user.password);
      if (!valid) {
        this.recordFailedAttempt(identifier);
        return { success: false, message: "Invalid credentials" };
      }

      // Clear failed attempts on successful login
      this.clearFailedAttempts(identifier);

      // Generate token
      const token = this.generateToken({
        id: user.id,
        userid: user.userid,
        role: user.role,
        orgId: user.orgId,
      });

      return {
        success: true,
        message: "Authentication successful",
        token,
        user: {
          id: user.id,
          userid: user.userid,
          email: user.email, // NEW: Include email
          role: user.role,
          orgId: user.orgId,
          isFirstLogin: user.isFirstLogin, // NEW: Include first login status
        },
      };
    } catch (error) {
      console.error("Authentication error:", error);
      return { success: false, message: "Authentication failed" };
    }
  }

  /** Create a new user with role-based orgId validation and email */
  static async createUser(
    userid: string,
    email: string, // NEW: Email parameter
    password: string,
    role: "SUPER_ADMIN" | "ORGANIZATION_ADMIN",
    orgId: string | null = null
  ): Promise<CreateUserResult> {
    try {
      // Input validation
      if (!userid?.trim()) {
        return { success: false, message: "User ID is required" };
      }

      if (!email?.trim()) {
        // NEW: Email validation
        return { success: false, message: "Email is required" };
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return { success: false, message: "Invalid email format" };
      }

      if (!password || password.length < 8) {
        return {
          success: false,
          message: "Password must be at least 8 characters long",
        };
      }

      if (!role || !["SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(role)) {
        return { success: false, message: "Invalid role specified" };
      }

      // Role-specific validation
      if (role === "ORGANIZATION_ADMIN" && !orgId?.trim()) {
        return {
          success: false,
          message: "Organization ID is required for Organization Admin",
        };
      }

      if (role === "SUPER_ADMIN") {
        orgId = null; // Ensure super admin has no org restriction
      }

      // Check for existing user (userid)
      const existingUser = await db.user.findUnique({
        where: { userid: userid.trim() },
      });

      if (existingUser) {
        return { success: false, message: "User ID already exists" };
      }

      // Check for existing email                       // NEW: Email uniqueness check
      const existingEmail = await db.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });

      if (existingEmail) {
        return { success: false, message: "Email already exists" };
      }

      // Hash password and create user
      const hashedPassword = await this.hashPassword(password);
      const user = await db.user.create({
        data: {
          userid: userid.trim(),
          email: email.trim().toLowerCase(), // NEW: Store email
          password: hashedPassword,
          role,
          orgId: orgId?.trim() || null,
          isFirstLogin: true, // NEW: Default to first login
          // passwordChangedAt will be null initially
        },
        select: {
          id: true,
          userid: true,
          email: true, // NEW: Include in response
          role: true,
          orgId: true,
          isFirstLogin: true, // NEW: Include in response
          createdAt: true,
        },
      });

      return {
        success: true,
        message: "User created successfully",
        user,
      };
    } catch (error) {
      console.error("User creation error:", error);
      return { success: false, message: "User creation failed" };
    }
  }

  /** Handle first login password change */ // NEW: First login password change
  static async changePasswordFirstLogin(
    userid: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Find user
      const user = await db.user.findUnique({
        where: { userid },
        select: {
          id: true,
          password: true,
          isFirstLogin: true,
        },
      });

      if (!user) {
        return { success: false, message: "User not found" };
      }

      if (!user.isFirstLogin) {
        return { success: false, message: "Not a first login user" };
      }

      // Verify current password
      const valid = await this.comparePassword(currentPassword, user.password);
      if (!valid) {
        return { success: false, message: "Current password is incorrect" };
      }

      // Validate new password
      if (newPassword.length < 8) {
        return {
          success: false,
          message: "New password must be at least 8 characters long",
        };
      }

      if (currentPassword === newPassword) {
        return {
          success: false,
          message: "New password must be different from current password",
        };
      }

      // Hash new password and update user
      const hashedNewPassword = await this.hashPassword(newPassword);
      await db.user.update({
        where: { userid },
        data: {
          password: hashedNewPassword,
          isFirstLogin: false, // NEW: Mark as not first login
          passwordChangedAt: new Date(), // NEW: Record password change time
        },
      });

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      console.error("Password change error:", error);
      return { success: false, message: "Password change failed" };
    }
  }

  /** Validate user session */
  static async validateSession(token: string): Promise<JWTPayload | null> {
    if (!token) return null;

    const payload = this.verifyToken(token);
    if (!payload) return null;

    try {
      // Verify user still exists and is active
      const user = await db.user.findUnique({
        where: { id: payload.id },
        select: { id: true, userid: true, role: true, orgId: true },
      });

      if (!user) return null;

      // Ensure payload matches current user data
      if (
        user.userid !== payload.userid ||
        user.role !== payload.role ||
        user.orgId !== payload.orgId
      ) {
        return null;
      }

      return payload;
    } catch (error) {
      console.error("Session validation error:", error);
      return null;
    }
  }

  /** Refresh JWT token */
  static async refreshToken(token: string): Promise<{
    success: boolean;
    message: string;
    token?: string;
    user?: {
      id: number;
      userid: string;
      role: string;
      orgId: string | null;
    };
  }> {
    try {
      const payload = await this.validateSession(token);

      if (!payload) {
        return { success: false, message: "Invalid or expired token" };
      }

      const newToken = this.generateToken(payload);

      return {
        success: true,
        message: "Token refreshed successfully",
        token: newToken,
        user: {
          id: payload.id,
          userid: payload.userid,
          role: payload.role,
          orgId: payload.orgId,
        },
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      return { success: false, message: "Token refresh failed" };
    }
  }
}
