// components/sections/why-choose-us-section.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, TrendingUp, Zap } from "lucide-react";

export function WhyChooseUsSection() {
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

  const benefits = [
    {
      icon: Building2,
      title: "Government Trusted",
      description:
        "Built on Bhutan's national digital identity infrastructure with government-grade security protocols.",
      gradient: "from-ndi-primary to-ndi-secondary",
    },
    {
      icon: TrendingUp,
      title: "Cost-Effective",
      description:
        "Eliminate printing and postal costs while reducing document processing time from days to minutes.",
      gradient: "from-ndi-secondary to-ndi-primary",
    },
    {
      icon: Zap,
      title: "Enhanced Efficiency",
      description:
        "Accelerate business processes, enable remote signing, and streamline compliance workflows.",
      gradient: "from-ndi-primary to-ndi-secondary",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Bhutan NDI?
          </h2>
          <p className="text-xl text-gray-600">
            Trusted by government and enterprises across Bhutan
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className={`border-0 shadow-lg text-center p-6 hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 group cursor-pointer relative overflow-hidden ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Animated background gradient on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500 group-hover:scale-110`}
              ></div>

              <CardContent className="space-y-4 relative z-10">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-full flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-125 group-hover:shadow-lg`}
                >
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 group-hover:text-ndi-primary transition-colors duration-300">
                  {benefit.title}
                </h3>

                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  {benefit.description}
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
