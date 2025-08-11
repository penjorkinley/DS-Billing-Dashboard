"use client";

import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BillingHeaderProps } from "./types";

export default function BillingHeader({
  isSubmitting,
  onSave,
}: BillingHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Billing Configuration
        </h1>
        <p className="text-muted-foreground">
          Configure pricing and billing options for digital signature services
        </p>
      </div>

      <Button
        onClick={onSave}
        disabled={isSubmitting}
        className="min-w-[140px] bg-green-600 hover:bg-green-700 text-white border-0"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </>
        )}
      </Button>
    </div>
  );
}
