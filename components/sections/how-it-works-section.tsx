// components/sections/how-it-works-section.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileText,
  ScrollText,
  Mail,
  QrCode,
  Verified,
} from "lucide-react";

export function HowItWorksSection() {
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

  const documentCreatorSteps = [
    {
      icon: Users,
      title: "Add Signatories",
      description:
        "Easily add one or multiple signatories with sequential signing workflows",
    },
    {
      icon: FileText,
      title: "Upload Document",
      description:
        "Securely upload any document format while maintaining integrity",
    },
    {
      icon: ScrollText,
      title: "Place Signature Fields",
      description: "Position signature placeholders with intuitive interface",
    },
  ];

  const signatoriesSteps = [
    {
      icon: Mail,
      title: "Instant Notifications",
      description: "Receive email alerts with QR codes for mobile convenience",
    },
    {
      icon: QrCode,
      title: "Flexible Access",
      description:
        "Sign using QR code on mobile or one-click access on desktop",
    },
    {
      icon: Verified,
      title: "Secure Authentication",
      description:
        "Access through verified Bhutan NDI wallet with cryptographic security",
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Simple, secure, and efficient in just a few steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* For Document Creators */}
          <Card
            className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-700 ease-in-out transform hover:-translate-y-3 group overflow-hidden relative ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 gradient-ndi opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 gradient-ndi rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-125">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-ndi-primary transition-colors duration-300">
                  For Document Creators
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              {documentCreatorSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 group/item hover:bg-gradient-to-r hover:from-ndi-secondary/5 hover:to-transparent p-3 rounded-lg transition-all duration-300 transform hover:translate-x-2"
                >
                  <step.icon className="h-5 w-5 text-ndi-secondary mt-1 flex-shrink-0 transition-all duration-300 group-hover/item:scale-125" />
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover/item:text-ndi-primary transition-colors duration-300">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 group-hover/item:text-gray-700 transition-colors duration-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* For Signatories */}
          <Card
            className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-700 ease-in-out transform hover:-translate-y-3 group overflow-hidden relative ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 gradient-ndi-reverse opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

            <CardHeader className="relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 gradient-ndi-reverse rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-125">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-ndi-primary transition-colors duration-300">
                  For Signatories
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              {signatoriesSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 group/item hover:bg-gradient-to-r hover:from-ndi-primary/5 hover:to-transparent p-3 rounded-lg transition-all duration-300 transform hover:translate-x-2"
                >
                  <step.icon className="h-5 w-5 text-ndi-primary mt-1 flex-shrink-0 transition-all duration-300 group-hover/item:scale-125" />
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover/item:text-ndi-primary transition-colors duration-300">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 group-hover/item:text-gray-700 transition-colors duration-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
