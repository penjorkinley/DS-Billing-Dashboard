// components/sections/cta-section.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  return (
    <section
      ref={sectionRef}
      className="py-16 gradient-ndi relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="absolute inset-0 bg-black/10"></div>

      <div
        className={`max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Experience the Future of Digital Trust?
        </h2>

        <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
          Join organizations across Bhutan already using the world's first
          DID-powered Digital Signature Platform for secure, verifiable, and
          legally robust document signing
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Button
            onClick={() => router.push("/login")}
            size="lg"
            className="bg-white text-ndi-primary hover:bg-gray-100 hover:text-ndi-secondary font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl group px-8 py-4 text-lg"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-ndi-primary font-semibold transition-all duration-300 transform hover:scale-110 px-8 py-4 text-lg"
            onClick={() => router.push("/login")}
          >
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-white mb-1">100%</div>
            <div className="text-white/80 text-sm">Verifiable Signatures</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              World's First
            </div>
            <div className="text-white/80 text-sm">DID-Powered Platform</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">Government</div>
            <div className="text-white/80 text-sm">Grade Security</div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center space-x-8 opacity-70">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
