// components/sections/footer.tsx
"use client";

import Image from "next/image";

export function Footer() {
  return (
    <footer className="py-12 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/ndi-logo.svg"
                alt="Bhutan NDI Logo"
                width={40}
                height={40}
                className="w-10 h-10"
                priority
              />
            </div>
            <div>
              <span className="text-xl font-bold text-white">
                Bhutan NDI Digital Signature Platform
              </span>
            </div>
          </div>
          <p className="text-gray-400 mb-4">
            Secure, Trusted, and Legally Compliant Digital Document Signing
          </p>
          <p className="text-sm text-gray-500">
            © 2024 Bhutan National Digital Identity Limited. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
