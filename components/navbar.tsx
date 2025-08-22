// components/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  showLoginButton?: boolean;
  className?: string;
}

export function Navbar({ showLoginButton = true, className }: NavbarProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
          : "bg-transparent",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group transition-transform duration-200 hover:scale-105"
            onClick={handleLogoClick}
          >
            <div className="relative">
              <Image
                src="/ndi-logo.svg"
                alt="Bhutan NDI"
                width={40}
                height={40}
                className="transition-transform duration-200 group-hover:rotate-3"
                priority
              />
            </div>
            <div className="transition-colors duration-200">
              <span className="text-xl font-bold text-ndi-primary group-hover:text-ndi-secondary">
                Bhutan NDI
              </span>
              <p className="text-xs text-gray-600 group-hover:text-ndi-primary transition-colors duration-200">
                Digital Signature Platform
              </p>
            </div>
          </div>

          {/* Login Button */}
          {showLoginButton && (
            <Button
              onClick={handleLoginClick}
              className="bg-ndi-primary hover:bg-ndi-secondary text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
