// components/sections/pricing-section.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, CreditCard } from "lucide-react";

export function PricingSection() {
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

  const pricingOptions = [
    {
      icon: CreditCard,
      title: "Prepaid",
      subtitle: "Buy signatures upfront and use anytime",
      features: [
        "Nu. 5 per signature (all types)",
        "Pay once, use anytime",
        "No expiry on purchased signatures",
        "Bulk purchase options available",
      ],
      note: "Purchase signature credits in advance - perfect for predictable usage",
      gradient: "from-ndi-primary to-ndi-secondary",
    },
    {
      icon: Clock,
      title: "Enterprise (Postpaid)",
      subtitle: "Subscribe with validity period, pay for actual usage",
      features: [
        "Nu. 5 per signature (all types)",
        "Subscribe with custom end date",
        "Pay only for signatures used",
        "Perfect for variable usage patterns",
      ],
      note: "Subscribe till your preferred date and pay based on actual usage",
      gradient: "from-ndi-secondary to-ndi-primary",
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Flexible Subscription Models
          </h2>
          <p className="text-xl text-gray-600">
            Choose the billing model that best fits your organization's needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingOptions.map((option, index) => (
            <Card
              key={index}
              className={`border-0 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : `opacity-0 ${
                      index === 0 ? "-translate-x-8" : "translate-x-8"
                    }`
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Background gradient with scale effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${option.gradient} transition-transform duration-700 group-hover:scale-110`}
              ></div>

              {/* Animated overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

              <div className="relative z-10 p-8 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-500 group-hover:scale-125">
                    <option.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold">{option.title}</h3>
                </div>

                <p className="text-lg mb-6 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  {option.subtitle}
                </p>

                <div className="space-y-3 mb-6">
                  {option.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center space-x-3 group/item transition-all duration-300 hover:translate-x-2"
                    >
                      <CheckCircle className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover/item:scale-125" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/30 transition-all duration-500 group-hover:bg-white/30 group-hover:transform group-hover:scale-105">
                  <p className="text-xs">{option.note}</p>
                </div>

                {/* Floating elements */}
                <div className="absolute top-6 right-6 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-20 right-8 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
