// components/sections/pricing-section.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Plan {
  tier: string;
  price: string;
  quantity: string;
  overageRate: string;
  features: string[];
  gradient: string;
  isElite?: boolean;
}

export function PricingSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("signatures");
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

  const signaturePlans: Plan[] = [
    {
      tier: "Basic",
      price: "100,000",
      quantity: "20,000",
      overageRate: "5",
      features: [
        "20,000 signatures included",
        "Nu. 5 per additional signature",
      ],
      gradient: "from-ndi-primary to-ndi-secondary",
    },
    {
      tier: "Plus",
      price: "200,000",
      quantity: "50,000",
      overageRate: "4",
      features: [
        "50,000 signatures included",
        "Nu. 4 per additional signature",
      ],
      gradient: "from-ndi-secondary to-ndi-primary",
    },
    {
      tier: "Premium",
      price: "300,000",
      quantity: "100,000",
      overageRate: "3",
      features: [
        "100,000 signatures included",
        "Nu. 3 per additional signature",
      ],
      gradient: "from-ndi-primary to-ndi-secondary",
    },
    {
      tier: "Elite",
      price: "800,000",
      quantity: "Unlimited",
      overageRate: "0",
      features: ["Unlimited signatures", "No overage charges"],
      gradient: "from-gray-800 to-gray-900",
      isElite: true,
    },
  ];

  const verificationPlans: Plan[] = [
    {
      tier: "Basic",
      price: "10,000",
      quantity: "500",
      overageRate: "20",
      features: [
        "500 verifications included",
        "Nu. 20 per additional verification",
      ],
      gradient: "from-ndi-primary to-ndi-secondary",
    },
    {
      tier: "Plus",
      price: "20,000",
      quantity: "2,000",
      overageRate: "10",
      features: [
        "2,000 verifications included",
        "Nu. 10 per additional verification",
      ],
      gradient: "from-ndi-secondary to-ndi-primary",
    },
    {
      tier: "Premium",
      price: "35,000",
      quantity: "5,000",
      overageRate: "7",
      features: [
        "5,000 verifications included",
        "Nu. 7 per additional verification",
      ],
      gradient: "from-ndi-primary to-ndi-secondary",
    },
    {
      tier: "Elite",
      price: "50,000",
      quantity: "Unlimited",
      overageRate: "0",
      features: ["Unlimited verifications", "No overage charges"],
      gradient: "from-gray-800 to-gray-900",
      isElite: true,
    },
  ];

  const currentPlans: Plan[] =
    activeTab === "signatures" ? signaturePlans : verificationPlans;

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-gray-50/50 to-white"
      id="pricing"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Flexible annual subscriptions designed to scale with your
            organization's needs
          </p>

          {/* Modern Service Category Tabs */}
          <div className="inline-flex bg-white rounded-2xl p-2 shadow-lg border border-gray-100 mb-12">
            <button
              onClick={() => setActiveTab("signatures")}
              className={`flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "signatures"
                  ? "bg-ndi-primary text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <FileText className="h-5 w-5 mr-3" />
              Digital Signatures
            </button>
            <button
              onClick={() => setActiveTab("verifications")}
              className={`flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "verifications"
                  ? "bg-ndi-primary text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Shield className="h-5 w-5 mr-3" />
              Verifications
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {currentPlans.map((plan, index) => (
            <Card
              key={plan.tier}
              className={`relative overflow-hidden border-0 bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                plan.isElite
                  ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
                  : "shadow-md hover:shadow-xl"
              } ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="p-8">
                {/* Plan header */}
                <div className="text-center mb-8">
                  <h3
                    className={`text-2xl font-bold mb-4 ${
                      plan.isElite ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.tier}
                  </h3>
                  <div
                    className={`text-5xl font-bold mb-2 ${
                      plan.isElite ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Nu. {plan.price}
                  </div>
                  <div
                    className={`text-sm ${
                      plan.isElite ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    per year
                  </div>
                </div>

                {/* Quantity highlight */}
                <div
                  className={`text-center mb-8 p-6 rounded-2xl ${
                    plan.isElite
                      ? "bg-white/10 border border-white/20"
                      : "bg-gradient-to-r from-ndi-primary/5 to-ndi-secondary/5 border border-ndi-primary/10"
                  }`}
                >
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      plan.isElite ? "text-white" : "text-ndi-primary"
                    }`}
                  >
                    {plan.quantity}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      plan.isElite ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {activeTab === "signatures"
                      ? "signatures included"
                      : "verifications included"}
                  </div>
                  {plan.overageRate !== "0" && (
                    <div
                      className={`text-xs mt-2 ${
                        plan.isElite ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Nu. {plan.overageRate} per additional
                    </div>
                  )}
                </div>

                {/* Features list */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle
                        className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                          plan.isElite ? "text-green-400" : "text-ndi-secondary"
                        }`}
                      />
                      <span
                        className={`text-sm leading-relaxed ${
                          plan.isElite ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
                    plan.isElite
                      ? "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                      : "bg-gray-900 text-white hover:bg-gray-800 shadow-md"
                  }`}
                >
                  Get Started with {plan.tier}
                </Button>
              </div>

              {/* Decorative elements for non-elite plans */}
              {!plan.isElite && (
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-ndi-primary/10 to-ndi-secondary/10 rounded-full blur-2xl"></div>
              )}
            </Card>
          ))}
        </div>

        {/* Bottom info section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center space-x-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-ndi-primary">
                Mix & Match
              </div>
              <div className="text-sm text-gray-600">
                Different tiers for each service
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-ndi-primary">
                Annual Billing
              </div>
              <div className="text-sm text-gray-600">
                Predictable pricing structure
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-ndi-primary">
                No Setup Fee
              </div>
              <div className="text-sm text-gray-600">
                Start using immediately
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
