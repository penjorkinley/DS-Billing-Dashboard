import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db";

export interface JWTPayload {
  id: number;
  userid: string;
  role: string;
  orgId: string | null;
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET!;
  private static readonly JWT_EXPIRES_IN = "24h";

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // Compare password
  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  // Verify JWT token
  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  // Authenticate user
  static async authenticateUser(userid: string, password: string) {
    try {
      // Find user in database
      const user = await db.user.findUnique({
        where: { userid },
      });

      if (!user) {
        return { success: false, message: "Invalid credentials" };
      }

      // Check password
      const isPasswordValid = await this.comparePassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return { success: false, message: "Invalid credentials" };
      }

      // Generate token
      const token = this.generateToken({
        id: user.id,
        userid: user.userid,
        role: user.role,
        orgId: user.orgId,
      });

      return {
        success: true,
        token,
        user: {
          id: user.id,
          userid: user.userid,
          role: user.role,
          orgId: user.orgId,
        },
      };
    } catch (error) {
      console.error("Authentication error:", error);
      return { success: false, message: "Authentication failed" };
    }
  }

  // Create user (for initial setup)
  static async createUser(
    userid: string,
    password: string,
    role: "SUPER_ADMIN" | "ORGANIZATION_ADMIN",
    orgId: string | null = null
  ) {
    try {
      // Validate orgId based on role
      if (role === "ORGANIZATION_ADMIN" && !orgId) {
        return {
          success: false,
          message: "Organization ID is required for Organization Admin",
        };
      }

      if (role === "SUPER_ADMIN" && orgId) {
        // Set orgId to null for super admin
        orgId = null;
      }

      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { userid },
      });

      if (existingUser) {
        return { success: false, message: "User already exists" };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create user
      const user = await db.user.create({
        data: {
          userid,
          password: hashedPassword,
          role,
          orgId,
        },
        select: {
          id: true,
          userid: true,
          role: true,
          orgId: true,
          createdAt: true,
        },
      });

      return { success: true, user };
    } catch (error) {
      console.error("User creation error:", error);
      return { success: false, message: "User creation failed" };
    }
  }
}
