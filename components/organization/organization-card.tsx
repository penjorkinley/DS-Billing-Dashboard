"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditOrganizationDialog } from "@/components/organization/edit-organization-dialog";
import { useToast } from "@/lib/toast-context";
import { copyToClipboard } from "@/lib/clipboard";
import {
  Calendar,
  Edit,
  DollarSign,
  FileText,
  Clock,
  Copy,
  CheckCircle,
} from "lucide-react";
import {
  type OrganizationDisplay,
  type EditOrganizationData,
} from "@/lib/schemas/organization";

// Extended organization interface with subscription details for backward compatibility
export interface OrganizationWithSubscription extends OrganizationDisplay {
  subscriptionDetails?: {
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
  const { showToast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatOrgId = (orgId: string) => {
    if (orgId.length <= 8) {
      return orgId;
    }
    // Show first 4 characters + "..." + last 4 characters
    return `${orgId.slice(0, 4)}...${orgId.slice(-4)}`;
  };

  const handleCopyOrgId = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const success = await copyToClipboard(organization.orgId);

      if (success) {
        setCopySuccess(true);
        showToast({
          type: "success",
          title: "Copied!",
          message: `Organization ID "${organization.orgId}" copied to clipboard`,
          duration: 2000,
        });

        // Reset copy success state after 2 seconds
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        throw new Error("Copy operation failed");
      }
    } catch (err) {
      console.error("Copy error:", err);
      showToast({
        type: "error",
        title: "Copy Failed",
        message:
          "Unable to copy to clipboard. Please try selecting and copying manually.",
        duration: 3000,
      });
    }
  };

  // Handle card click - only flip if dialog is not open
  const handleCardClick = () => {
    if (!isDialogOpen) {
      onCardClick();
    }
  };

  // Handle edit button click
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div
      className="flip-card-container group"
      style={{ height: "340px", perspective: "1000px" }}
    >
      <div
        className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}
        onClick={handleCardClick}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          textAlign: "center",
          transition: "transform 0.6s ease-in-out",
          transformStyle: "preserve-3d",
          cursor: isDialogOpen ? "default" : "pointer",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          pointerEvents: isDialogOpen ? "none" : "auto",
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
              <div style={{ pointerEvents: "auto" }}>
                <EditOrganizationDialog
                  organization={organization}
                  onSave={onUpdate}
                  onOpenChange={setIsDialogOpen}
                >
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
                    onClick={handleEditClick}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </EditOrganizationDialog>
              </div>
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
                    Nu. {organization.monthlyRevenue.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-left pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Organization ID:
                  </span>
                  <div
                    className="flex items-center gap-1"
                    style={{ pointerEvents: "auto" }}
                  >
                    <span
                      className="font-mono text-xs px-2 py-1 "
                      title={organization.orgId} // Show full ID on hover
                    >
                      {formatOrgId(organization.orgId)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-200"
                      onClick={handleCopyOrgId}
                      title="Copy Organization ID"
                    >
                      {copySuccess ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-sm font-medium">
                    {formatDate(organization.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Side - Subscription Details */}
        <Card
          className="flip-card-back border-0 shadow-md"
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
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  organization.subscription === "prepaid"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {organization.subscription === "prepaid"
                  ? "Prepaid Plan"
                  : "Postpaid Plan"}
              </div>
            </div>

            {organization.subscription === "prepaid" ? (
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 uppercase tracking-wide">
                    Remaining Balance
                  </p>
                  <p className="text-xl font-bold text-blue-900">
                    Nu.{" "}
                    {(
                      organization.subscriptionDetails?.remainingBalance ||
                      25000
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm pb-2">
                  <div>
                    <p className="text-muted-foreground">Single Signs</p>
                    <p className="font-semibold">
                      {organization.subscriptionDetails?.singleSignaturesUsed ||
                        150}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Multi Signs</p>
                    <p className="font-semibold">
                      {organization.subscriptionDetails
                        ?.multipleSignaturesUsed || 75}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Since {formatDate(organization.createdAt)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-600 uppercase tracking-wide">
                    Total Incurred
                  </p>
                  <p className="text-xl font-bold text-purple-900">
                    Nu.{" "}
                    {(
                      organization.subscriptionDetails?.totalIncurred ||
                      organization.monthlyRevenue * 3
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Single Signs</p>
                    <p className="font-semibold">
                      {organization.subscriptionDetails?.singleSignaturesUsed ||
                        150}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Multi Signs</p>
                    <p className="font-semibold">
                      {organization.subscriptionDetails
                        ?.multipleSignaturesUsed || 20}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Billing Cycle:</span>
                  <span className="font-medium">
                    {
                      billingCycleLabels[
                        organization.subscriptionDetails?.billingCycle ||
                          "quarterly"
                      ]
                    }
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Since {formatDate(organization.createdAt)}</span>
                    </div>
                    <span>
                      Ends{" "}
                      {organization.subscriptionDetails?.subscriptionEndDate
                        ? formatDate(
                            organization.subscriptionDetails.subscriptionEndDate
                          )
                        : "15 Feb 2024"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
