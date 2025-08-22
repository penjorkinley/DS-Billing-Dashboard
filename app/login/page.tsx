// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/navbar";
import { useToast } from "@/lib/toast-context";
import { Eye, EyeOff, Loader2, Lock, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    userid: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (error) setError("");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userid || !formData.password) {
      setError("Please enter both User ID and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Success toast
        showToast({
          type: "success",
          title: "Login Successful",
          message: `Welcome back! Redirecting to your dashboard...`,
          duration: 3000,
        });

        // Determine redirect path based on role
        let redirectPath = "/dashboard";
        if (result.user?.role === "SUPER_ADMIN") {
          redirectPath = "/dashboard/super-admin";
        } else if (result.user?.role === "ORGANIZATION_ADMIN") {
          redirectPath = "/dashboard/organization";
        } else {
          showToast({
            type: "error",
            title: "Access Denied",
            message: "Invalid user role. Please contact administrator.",
          });
          setIsLoading(false);
          return;
        }

        // Give a small delay to ensure cookie is set and user can see success message
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 1500);
      } else {
        // Show error
        setError(result.message || "Invalid credentials. Please try again.");
        showToast({
          type: "error",
          title: "Login Failed",
          message: result.message || "Invalid credentials. Please try again.",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      showToast({
        type: "error",
        title: "Connection Error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Navigation */}
      <Navbar showLoginButton={false} />

      {/* Main Content Area - Two Columns on large screens, single column on mobile */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden pt-16">
        {/* Login Form Section */}
        <div className="w-full lg:w-[45%] flex items-center justify-center px-4 sm:px-8 py-4 lg:py-8">
          <div
            className="w-full max-w-sm lg:max-w-sm animate-fade-in"
            style={{ animationDuration: ".8s" }}
          >
            <Card className="border-none shadow-none sm:-mt-12">
              <CardHeader className="space-y-2 lg:space-y-3 text-center px-0">
                <div className="w-16 h-16 gradient-ndi rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl sm:text-4xl lg:text-4xl font-bold text-ndi-primary">
                  Kuzuzangpo!
                </CardTitle>
                <p className="text-sm sm:text-base text-muted-foreground">
                  <span className="text-ndi-secondary font-medium">Login</span>{" "}
                  to your Billing Dashboard
                </p>
              </CardHeader>

              <CardContent className="px-0">
                {error && (
                  <Alert className="border-red-200 bg-red-50 mb-6">
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Client ID Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="userid"
                      className="text-sm font-medium text-foreground"
                    >
                      Client ID
                    </Label>
                    <div className="relative">
                      <Input
                        id="userid"
                        name="userid"
                        type="text"
                        placeholder="UserID"
                        value={formData.userid}
                        onChange={handleInputChange}
                        className="pl-10 h-12 sm:h-11 focus-visible:ring-1 focus-visible:ring-ndi-primary placeholder:text-gray-400"
                        disabled={isLoading}
                        required
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
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
                        className="pl-10 pr-12 h-12 sm:h-11 focus-visible:ring-1 focus-visible:ring-ndi-primary placeholder:text-gray-400"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                    className="w-full h-12 sm:h-11 bg-ndi-primary hover:bg-ndi-secondary text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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

                {/* Additional Information */}
                <div className="pt-6 border-t border-gray-200 mt-6">
                  <p className="text-center text-sm text-gray-600">
                    Need access? Contact your organization administrator
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Hero Illustration (Hidden on mobile, visible on large screens) */}
        <div className="hidden lg:flex lg:w-[55%] items-center justify-center p-4 lg:p-8 overflow-hidden">
          <div
            className="w-full h-full max-w-4xl max-h-full flex items-center justify-center animate-fade-in"
            style={{ animationDuration: ".8s" }}
          >
            <Image
              src="/login-hero-img.svg"
              alt="Digital Signature Login illustration"
              width={1200}
              height={800}
              priority
              className="w-full h-auto max-h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
