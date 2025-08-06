"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    userid: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Login response:", result);

      if (result.success) {
        console.log("Login successful, user role:", result.user?.role);

        // Role-based redirection - direct to specific dashboards only
        let redirectPath: string;

        switch (result.user?.role) {
          case "SUPER_ADMIN":
            redirectPath = "/dashboard/super-admin";
            break;
          case "ORGANIZATION_ADMIN":
            redirectPath = "/dashboard/organization";
            break;
          default:
            // If no specific role, redirect to login (shouldn't happen)
            redirectPath = "/login";
            setError("Invalid user role. Please contact administrator.");
            setIsLoading(false);
            return;
        }

        console.log("Redirecting to:", redirectPath);

        // Give a small delay to ensure cookie is set, then redirect
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 100);
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Image
              src="/logo.svg"
              alt="Bhutan NDI"
              width={120}
              height={40}
              priority
              className="mx-auto mb-4"
            />
          </div>

          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold text-brand-primary">
                Kuzuzangpo!
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                <span className="text-brand-secondary font-medium">Login</span>{" "}
                to your Admin Dashboard
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Client ID Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="userid"
                    className="text-sm font-medium text-foreground"
                  >
                    Client ID
                  </Label>
                  <Input
                    id="userid"
                    name="userid"
                    type="text"
                    placeholder="UserID"
                    value={formData.userid}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="h-11 focus-visible:ring-brand-primary"
                    required
                  />
                </div>

                {/* Client Secret Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Client Secret
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="h-11 pr-12 focus-visible:ring-brand-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-brand-primary hover:bg-brand-primary/90 text-primary-foreground font-medium transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Test Credentials Info */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center mb-2 font-medium">
              Test Credentials:
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <strong>Super Admin:</strong> superadmin / SuperAdmin123!
              </p>
              <p>
                <strong>Org Admin 1:</strong> orgadmin1 / OrgAdmin123!
              </p>
              <p>
                <strong>Org Admin 2:</strong> orgadmin2 / OrgAdmin123!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-primary/5 via-brand-secondary/5 to-brand-primary/10 items-center justify-center p-8">
        <div className="max-w-md animate-fade-in">
          <Image
            src="/login-hero-img.svg"
            alt="Login illustration"
            width={500}
            height={400}
            priority
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
