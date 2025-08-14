"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Copy,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { EditOrganizationDialog } from "@/components/organization/edit-organization-dialog";
import { useToast } from "@/lib/toast-context";
import { copyToClipboard } from "@/lib/clipboard";
import {
  type OrganizationDisplay,
  type EditOrganizationData,
} from "@/lib/schemas/organization";

interface OrganizationTableViewProps {
  organizations: OrganizationDisplay[];
  onUpdate: (orgId: string, updatedData: EditOrganizationData) => void;
}

export function OrganizationTableView({
  organizations,
  onUpdate,
}: OrganizationTableViewProps) {
  const { showToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination
  const totalItems = organizations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = organizations.slice(startIndex, endIndex);

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

  const handleCopyOrgId = async (orgId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const success = await copyToClipboard(orgId);

      if (success) {
        setCopiedId(orgId);
        showToast({
          type: "success",
          title: "Copied!",
          message: `Organization ID "${orgId}" copied to clipboard`,
          duration: 2000,
        });

        // Reset copied state after 2 seconds
        setTimeout(() => setCopiedId(null), 2000);
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

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToLastPage = () => setCurrentPage(totalPages);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <Card className="border-0 shadow-lg">
      {/* Table Container with Horizontal and Vertical Scroll */}
      <div className="overflow-auto max-h-[600px] p-4">
        <div className="min-w-[1000px]">
          {" "}
          {/* Minimum width to trigger horizontal scroll */}
          <Table className="border-gray-200">
            <TableHeader className="sticky top-0 ">
              <TableRow className="border-gray-200">
                <TableHead className="w-[200px] px-4 py-3">
                  Organization
                </TableHead>
                <TableHead className="w-[140px] px-4 py-3">
                  Organization ID
                </TableHead>
                <TableHead className="w-[100px] px-4 py-3">Status</TableHead>
                <TableHead className="w-[120px] px-4 py-3">
                  Subscription
                </TableHead>
                <TableHead className="w-[140px] px-4 py-3 text-right">
                  Monthly Revenue
                </TableHead>
                <TableHead className="w-[120px] px-4 py-3">
                  Webhook ID
                </TableHead>
                <TableHead className="w-[120px] px-4 py-3">
                  Created Date
                </TableHead>
                <TableHead className="w-[80px] px-4 py-3 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((org) => (
                <TableRow
                  key={org.orgId}
                  className="group border-gray-200 hover:bg-gray-50/50"
                >
                  <TableCell className="border-gray-200 px-4 py-4">
                    <div>
                      <div className="font-medium text-base mb-1">
                        {org.name}
                      </div>
                      <div className="text-sm text-muted-foreground truncate max-w-[180px]">
                        {org.webhookUrl}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="border-gray-200 px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-xs bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                        title={org.orgId} // Show full ID on hover
                      >
                        {formatOrgId(org.orgId)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
                        onClick={(e) => handleCopyOrgId(org.orgId, e)}
                        title="Copy Organization ID"
                      >
                        {copiedId === org.orgId ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="border-gray-200 px-4 py-4">
                    <Badge
                      variant={
                        org.status === "active" ? "default" : "secondary"
                      }
                      className={
                        org.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100 border-0"
                          : "bg-red-100 text-red-800 hover:bg-red-100 border-0"
                      }
                    >
                      {org.status === "active" ? "● Active" : "● Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="border-gray-200 px-4 py-4">
                    <Badge
                      variant="outline"
                      className="capitalize border-gray-200"
                    >
                      {org.subscription}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium border-gray-200 px-4 py-4">
                    Nu. {org.monthlyRevenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="border-gray-200 px-4 py-4">
                    <span className="font-mono text-sm">{org.webhookId}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground border-gray-200 px-4 py-4">
                    {formatDate(org.createdAt)}
                  </TableCell>
                  <TableCell className="text-right border-gray-200 px-4 py-4">
                    <EditOrganizationDialog
                      organization={org}
                      onSave={onUpdate}
                    >
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-accent"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </EditOrganizationDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems} organizations
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1 px-3">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
