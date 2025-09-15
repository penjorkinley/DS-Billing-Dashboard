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
        "NDI wallet verification, document integrity protection, and cryptographic signatures ensure maximum security beyond traditional e-signature systems.",
      hoverType: "scale",
    },
    {
      icon: CheckCircle,
      title: "Legally Robust & Permanent",
      description:
        "Every signature carries both visual assurance and cryptographic strength, ensuring contracts remain legally robust and permanently verifiable years into the future.",
      hoverType: "scale",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized Experience",
      description:
        "QR code functionality and responsive design enable seamless mobile device integration for signing anywhere, anytime.",
      hoverType: "scale",
    },
    {
      icon: Shield,
      title: "Next-Generation Technology",
      description:
        "Built on revolutionary e-signature technologies that move beyond conventional methods, setting new standards for digital trust and authentication.",
      hoverType: "scale",
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
            Beyond Traditional E-Signatures
          </h2>
          <p className="text-xl text-gray-600">
            A leap forward in digital trust that ensures authenticity today and
            years into the future
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
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Subtle background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-ndi-primary/5 to-ndi-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardContent className="p-8 relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-ndi-primary to-ndi-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-ndi-primary transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover effect particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-ndi-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-ndi-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-ping"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
