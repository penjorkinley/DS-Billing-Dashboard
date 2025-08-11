// File: components/organization/organization-card.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditOrganizationDialog } from "@/components/organization/edit-organization-dialog";
import { Calendar, Edit, DollarSign, FileText, Clock } from "lucide-react";
import {
  type Organization,
  type EditOrganizationData,
} from "@/lib/schemas/organization";

// Extended organization interface with subscription details
export interface OrganizationWithSubscription extends Organization {
  subscriptionDetails: {
    // For prepaid
    remainingBalance?: number;
    singleSignaturesUsed?: number;
    multipleSignaturesUsed?: number;
    subscriptionDate?: string;

    // For postpaid
    billingCycle?: "monthly" | "quarterly" | "half_yearly" | "yearly";
    totalIncurred?: number;
    subscriptionEndDate?: string;
  };
}

interface OrganizationCardProps {
  organization: OrganizationWithSubscription;
  isFlipped: boolean;
  onCardClick: () => void;
  onUpdate: (orgId: string, updatedData: EditOrganizationData) => void;
}

// Billing cycle display mapping
const billingCycleLabels = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  half_yearly: "Half Yearly",
  yearly: "Yearly",
};

export function OrganizationCard({
  organization,
  isFlipped,
  onCardClick,
  onUpdate,
}: OrganizationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="flip-card-container group"
      style={{ height: "340px", perspective: "1000px" }}
    >
      <div
        className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}
        onClick={onCardClick}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          textAlign: "center",
          transition: "transform 0.6s ease-in-out",
          transformStyle: "preserve-3d",
          cursor: "pointer",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Side */}
        <Card
          className="flip-card-front hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "12px",
          }}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {organization.name}
                </CardTitle>
              </div>
              <EditOrganizationDialog
                organization={organization}
                onSave={onUpdate}
              >
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </EditOrganizationDialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    organization.status === "active" ? "default" : "secondary"
                  }
                  className={
                    organization.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100 border-0"
                      : "bg-red-100 text-red-800 hover:bg-red-100 border-0"
                  }
                >
                  {organization.status === "active" ? "● Active" : "● Inactive"}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {organization.subscription}
                </Badge>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    Nu. {(organization.revenue / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Created: {formatDate(organization.createdAt)}
                </div>
              </div>

              <div className="text-center text-xs text-blue-600 font-medium pt-2">
                Click to view subscription details
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Side */}
        <Card
          className="flip-card-back hover:shadow-xl transition-all duration-300 border-0 shadow-md"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "12px",
          }}
        >
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              {organization.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {organization.subscription === "prepaid" ? (
              /* Prepaid Details - Simple */
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg pb-3 ">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">
                      Remaining Balance
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    Nu.{" "}
                    {organization.subscriptionDetails.remainingBalance?.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Single Signatures
                    </p>
                    <p className="text-lg font-bold">
                      {organization.subscriptionDetails.singleSignaturesUsed?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Multiple Signatures
                    </p>
                    <p className="text-lg font-bold">
                      {organization.subscriptionDetails.multipleSignaturesUsed?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Subscribed:{" "}
                    {organization.subscriptionDetails.subscriptionDate &&
                      formatDate(
                        organization.subscriptionDetails.subscriptionDate
                      )}
                  </div>
                </div>
              </div>
            ) : (
              /* Postpaid Details - Simple */
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg pb-1 ">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">
                      {organization.subscriptionDetails.billingCycle &&
                        billingCycleLabels[
                          organization.subscriptionDetails.billingCycle
                        ]}{" "}
                      Billing
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    Nu.{" "}
                    {organization.subscriptionDetails.totalIncurred?.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Incurred
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Single Signatures
                    </p>
                    <p className="text-lg font-bold">
                      {organization.subscriptionDetails.singleSignaturesUsed?.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Multiple Signatures
                    </p>
                    <p className="text-lg font-bold">
                      {organization.subscriptionDetails.multipleSignaturesUsed?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 justify-start">
                      <Calendar className="h-3 w-3" />
                      Started:{" "}
                      {organization.subscriptionDetails.subscriptionDate &&
                        formatDate(
                          organization.subscriptionDetails.subscriptionDate
                        )}
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Calendar className="h-3 w-3" />
                      Ends:{" "}
                      {organization.subscriptionDetails.subscriptionEndDate &&
                        formatDate(
                          organization.subscriptionDetails.subscriptionEndDate
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center text-xs text-blue-600 font-medium mt-4">
              Click to view basic details
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
