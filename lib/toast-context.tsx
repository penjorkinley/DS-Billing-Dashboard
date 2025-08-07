"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto dismiss after duration
    if (typeof newToast.duration === "number" && newToast.duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, newToast.duration);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getToastStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 shadow-lg";
      case "error":
        return "border-red-200 bg-red-50 shadow-lg";
      case "warning":
        return "border-amber-200 bg-amber-50 shadow-lg";
      case "info":
        return "border-blue-200 bg-blue-50 shadow-lg";
      default:
        return "border-gray-200 bg-white shadow-lg";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, clearAllToasts }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2 w-full max-w-md px-4">
        {toasts.map((toast) => (
          <Alert
            key={toast.id}
            className={`shadow-lg animate-in slide-in-from-top-2 duration-300 ${getToastStyles(
              toast.type
            )}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1">
              {toast.title && (
                <AlertTitle className="text-base font-semibold">
                  {toast.title}
                </AlertTitle>
              )}
              <AlertDescription className="text-sm leading-relaxed">
                {toast.message}
              </AlertDescription>
            </div>
          </Alert>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
