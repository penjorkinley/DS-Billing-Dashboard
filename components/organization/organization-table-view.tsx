// File: components/organization/organization-table-view.tsx
"use client";

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
import { Edit } from "lucide-react";
import { EditOrganizationDialog } from "@/components/organization/edit-organization-dialog";
import { type OrganizationWithSubscription } from "@/components/organization/organization-card";
import { type EditOrganizationData } from "@/lib/schemas/organization";

interface OrganizationTableViewProps {
  organizations: OrganizationWithSubscription[];
  onUpdate: (orgId: string, updatedData: EditOrganizationData) => void;
}

export function OrganizationTableView({
  organizations,
  onUpdate,
}: OrganizationTableViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="border-0 shadow-lg">
      <div className="px-4">
        <Table className="border-gray-200">
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead>Organization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id} className="group border-gray-200">
                <TableCell className="border-gray-200">
                  <div>
                    <div className="font-medium text-base">{org.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {org.shortName} • {org.contactEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="border-gray-200">
                  <Badge
                    variant={org.status === "active" ? "default" : "secondary"}
                    className={
                      org.status === "active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100 border-0"
                        : "bg-red-100 text-red-800 hover:bg-red-100 border-0"
                    }
                  >
                    {org.status === "active" ? "● Active" : "● Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="border-gray-200">
                  <Badge
                    variant="outline"
                    className="capitalize border-gray-200"
                  >
                    {org.subscription}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium border-gray-200">
                  Nu. {org.revenue.toLocaleString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground border-gray-200">
                  {formatDate(org.createdAt)}
                </TableCell>
                <TableCell className="text-right border-gray-200">
                  <EditOrganizationDialog organization={org} onSave={onUpdate}>
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
    </Card>
  );
}
