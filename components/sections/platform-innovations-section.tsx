// components/sections/platform-innovations-section.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Fingerprint, Users, Settings, Shield, Eye } from "lucide-react";

export function PlatformInnovationsSection() {
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

  const innovations = [
    {
      icon: Fingerprint,
      title: "Verifiable Identity Integration",
      description:
        "Each signatory's identity is bound to a Decentralized Identifier (DID) within the Bhutan NDI wallet, ensuring authenticity of every signing action.",
      gradient: "from-ndi-primary to-ndi-secondary",
    },
    {
      icon: Users,
      title: "Human and Machine Trust Combined",
      description:
        "Recipients see a visible, 'wet-ink-like' signature while the file is cryptographically signed (SHA-256) - recognizable to humans and irrefutable to machines.",
      gradient: "from-ndi-secondary to-ndi-primary",
    },
    {
      icon: Settings,
      title: "Multi-Signatory Workflow",
      description:
        "Platform enforces signing sequences and records each action in an immutable sequence, ensuring transparency and trust in complex agreements.",
      gradient: "from-ndi-primary to-ndi-secondary",
    },
    {
      icon: Shield,
      title: "Decentralized Identity Revolution",
      description:
        "Replaces traditional Certificate Authorities with user-controlled DIDs, ensuring only the rightful document owner can generate valid signatures.",
      gradient: "from-ndi-secondary to-ndi-primary",
    },
    {
      icon: Eye,
      title: "End-to-End Verifiability",
      description:
        "Public verification portal allows any signed document to be re-uploaded and checked for authenticity - validating signatures, timestamp, order, and integrity even years later.",
      gradient: "from-ndi-primary to-ndi-secondary",
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-white" id="innovations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Revolutionary Platform Innovations
          </h2>
          <p className="text-xl text-gray-600">
            Our Digital Signature Platform embodies breakthrough technologies
            that redefine digital trust
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {innovations.map((innovation, index) => (
            <Card
              key={index}
              className={`border-0 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Background gradient with scale effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${innovation.gradient} transition-transform duration-700 group-hover:scale-110`}
              ></div>

              {/* Animated overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

              <div className="relative z-10 p-8 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-500 group-hover:scale-125">
                    <innovation.icon className="h-8 w-8" />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-4">{innovation.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {innovation.description}
                </p>

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
