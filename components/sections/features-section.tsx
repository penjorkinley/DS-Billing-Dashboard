// components/sections/features-section.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, CheckCircle, Smartphone, Shield } from "lucide-react";

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Lock,
      title: "Uncompromising Security",
      description:
        "NDI wallet verification, document integrity protection, and cryptographic signatures ensure maximum security.",
      hoverType: "scale",
    },
    {
      icon: CheckCircle,
      title: "Consent-Driven Process",
      description:
        "Full user control with transparent workflows and authorized access only for verified signatories.",
      hoverType: "scale", // Changed to match others
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description:
        "QR code functionality and responsive design enable seamless mobile device integration.",
      hoverType: "scale",
    },
    {
      icon: Shield,
      title: "Dual Signature Technology",
      description:
        "Combines visual e-signatures with cryptographic digital signatures for complete authentication.",
      hoverType: "scale", // Changed to match others
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gradient-to-br from-gray-50 to-white"
      id="features"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Key Features & Benefits
          </h2>
          <p className="text-xl text-gray-600">
            Government-grade security meets user-friendly design
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-4 group cursor-pointer relative overflow-hidden ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 relative z-10">
                <div className="w-12 h-12 gradient-ndi rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-125">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-ndi-primary">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  {feature.description}
                </p>

                {/* Pulse indicator - consistent for all cards */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-ndi-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
