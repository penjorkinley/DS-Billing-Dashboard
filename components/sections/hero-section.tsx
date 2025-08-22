// components/sections/hero-section.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onScrollToSection: (sectionId: string) => void;
}

export function HeroSection({ onScrollToSection }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-ndi-secondary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-ndi-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-ndi-primary/5 to-ndi-secondary/5 rounded-full blur-3xl animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Badge
            variant="secondary"
            className="mb-6 bg-ndi-secondary/10 text-ndi-primary border-ndi-secondary/20 hover:bg-ndi-secondary/20 transition-all duration-300 transform hover:scale-105"
          >
            🇧🇹 Government Approved Digital Signature Solution
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Secure{" "}
            <span className="relative">
              <span className="text-gradient-ndi">Digital Signatures</span>
              <div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-ndi rounded-full transform scale-x-0 animate-scale-in"
                style={{ animationDelay: "1s", animationFillMode: "forwards" }}
              ></div>
            </span>{" "}
            for Bhutan
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform your document signing process with blockchain-powered
            security, NDI wallet integration, and legally compliant digital
            workflows trusted by government and enterprises.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              onClick={() => onScrollToSection("features")}
              size="lg"
              className="bg-ndi-primary hover:bg-ndi-secondary text-white transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl group px-8 py-4 text-lg"
            >
              Explore Features
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Button>
            <Button
              onClick={() => onScrollToSection("pricing")}
              variant="outline"
              size="lg"
              className="border-ndi-primary text-ndi-primary hover:bg-ndi-primary hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110 px-8 py-4 text-lg"
            >
              View Pricing
            </Button>
          </div>

          {/* Scroll indicator - positioned below buttons */}
          <div className="flex justify-center mt-8">
            <div className="w-6 h-10 border-2 border-ndi-primary rounded-full flex justify-center animate-bounce opacity-70 hover:opacity-100 transition-opacity duration-300">
              <div className="w-1 h-3 bg-ndi-primary rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
