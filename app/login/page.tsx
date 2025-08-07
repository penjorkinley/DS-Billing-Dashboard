"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/toast-context";
import logo from "@/public/ndi-logo.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    userid: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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

        // Show success toast
        showToast({
          type: "success",
          title: "Login Successful",
          message: "Welcome back! Redirecting to your dashboard...",
          duration: 2000,
        });

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
            showToast({
              type: "error",
              title: "Access Error",
              message: "Invalid user role. Please contact administrator.",
            });
            setIsLoading(false);
            return;
        }

        console.log("Redirecting to:", redirectPath);

        // Give a small delay to ensure cookie is set and user can see success message
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 1500);
      } else {
        // Show error toast
        showToast({
          type: "error",
          title: "Login Failed",
          message: result.message || "Invalid credentials. Please try again.",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
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
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Logo/Navbar Section - Full Width */}
      <div className="w-full px-4 sm:px-8 lg:px-16 pt-12 pb-8 lg:py-6 flex-shrink-0">
        <div className="flex justify-center lg:justify-start">
          <Image src={logo} alt="Bhutan NDI" width={200} height={50} priority />
        </div>
      </div>

      {/* Main Content Area - Two Columns on large screens, single column on mobile */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Login Form Section */}
        <div className="w-full lg:w-[45%] flex items-center justify-center px-4 sm:px-8 py-4 lg:py-8 ">
          <div
            className="w-full max-w-sm lg:max-w-sm animate-fade-in"
            style={{ animationDuration: ".8s" }}
          >
            <Card className="border-none shadow-none sm:-mt-12">
              <CardHeader className="space-y-2 lg:space-y-3 text-center px-0">
                <CardTitle className="text-3xl sm:text-4xl lg:text-4xl font-bold text-brand-primary">
                  Kuzuzangpo!
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-muted-foreground">
                  <span className="text-brand-secondary font-medium">
                    Login
                  </span>{" "}
                  to your Billing Dashboard
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0">
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
                    <Input
                      id="userid"
                      name="userid"
                      type="text"
                      placeholder="UserID"
                      value={formData.userid}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="h-12 sm:h-11 focus-visible:ring-1 focus-visible:ring-brand-primary placeholder:text-gray-400"
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
                        className="h-12 sm:h-11 pr-12 focus-visible:ring-1 focus-visible:ring-brand-primary placeholder:text-gray-400"
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
                    className="w-full h-12 sm:h-11 bg-brand-primary hover:bg-brand-primary/90 text-white font-medium transition-colors"
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
          </div>
        </div>

        {/* Right Side - Hero Illustration (Hidden on mobile, visible on large screens) */}
        <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-brand-primary/5 via-brand-secondary/5 to-brand-primary/10 items-center justify-center p-4 lg:p-8 overflow-hidden">
          <div
            className="w-full h-full max-w-4xl max-h-full flex items-center justify-center animate-fade-in"
            style={{ animationDuration: ".8s" }}
          >
            <Image
              src="/login-hero-img.svg"
              alt="Login illustration"
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
