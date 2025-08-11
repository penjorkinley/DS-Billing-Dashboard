// File: components/organization/organization-filters.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Grid3X3, List } from "lucide-react";

type ViewMode = "grid" | "table";

interface OrganizationFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalCount: number;
  filteredCount: number;
  onClearFilters: () => void;
}

export function OrganizationFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
  onClearFilters,
}: OrganizationFiltersProps) {
  const hasActiveFilters = searchQuery || statusFilter !== "all";

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className={`h-8 px-3 ${
                viewMode === "grid" ? "bg-white shadow-sm" : ""
              }`}
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Cards
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("table")}
              className={`h-8 px-3 ${
                viewMode === "table" ? "bg-white shadow-sm" : ""
              }`}
            >
              <List className="h-4 w-4 mr-1" />
              Table
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredCount} of {totalCount} organizations
          </span>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
