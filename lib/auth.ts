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
  // Validate that JWT_SECRET exists and is sufficiently strong
  private static readonly JWT_SECRET = (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is required");
    }
    if (secret.length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters long");
    }
    return secret;
  })();

  private static readonly JWT_EXPIRES_IN = "24h";

  /** Hash a plaintext password */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /** Compare plaintext to hashed password */
  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /** Generate a signed JWT */
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  /** Verify a JWT and return its payload or null */
  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JWTPayload;
    } catch {
      return null;
    }
  }

  /** Authenticate a user and return a JWT on success */
  static async authenticateUser(userid: string, password: string) {
    try {
      const user = await db.user.findUnique({ where: { userid } });
      if (!user) {
        return { success: false, message: "Invalid credentials" };
      }

      const valid = await this.comparePassword(password, user.password);
      if (!valid) {
        return { success: false, message: "Invalid credentials" };
      }

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

  /** Create a new user (for setup) with role-based orgId validation */
  static async createUser(
    userid: string,
    password: string,
    role: "SUPER_ADMIN" | "ORGANIZATION_ADMIN",
    orgId: string | null = null
  ) {
    try {
      if (role === "ORGANIZATION_ADMIN" && !orgId) {
        return {
          success: false,
          message: "Organization ID is required for Organization Admin",
        };
      }
      if (role === "SUPER_ADMIN") {
        orgId = null;
      }

      const existing = await db.user.findUnique({ where: { userid } });
      if (existing) {
        return { success: false, message: "User already exists" };
      }

      const hashed = await this.hashPassword(password);
      const user = await db.user.create({
        data: { userid, password: hashed, role, orgId },
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
