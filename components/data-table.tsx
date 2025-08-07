"use client";

import { useState, useMemo } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample data types
type SuperAdminData = {
  id: string;
  organization: string;
  users: number;
  revenue: number;
  status: "active" | "inactive";
  lastUpdated: string;
};

type OrgAdminData = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
};

// Sample data for Super Admin
const superAdminData: SuperAdminData[] = [
  {
    id: "ORG001",
    organization: "Ministry of IT",
    users: 145,
    revenue: 25400,
    status: "active",
    lastUpdated: "2024-01-15",
  },
  {
    id: "ORG002",
    organization: "Department of Revenue",
    users: 87,
    revenue: 18200,
    status: "active",
    lastUpdated: "2024-01-14",
  },
  {
    id: "ORG003",
    organization: "Digital Bhutan",
    users: 203,
    revenue: 35600,
    status: "active",
    lastUpdated: "2024-01-16",
  },
  {
    id: "ORG004",
    organization: "Health Ministry",
    users: 76,
    revenue: 12800,
    status: "inactive",
    lastUpdated: "2024-01-10",
  },
  {
    id: "ORG005",
    organization: "Education Department",
    users: 134,
    revenue: 22900,
    status: "active",
    lastUpdated: "2024-01-15",
  },
];

// Sample data for Organization Admin
const orgAdminData: OrgAdminData[] = [
  {
    id: "1",
    name: "Tenzin Wangchuk",
    email: "tenzin.w@mit.gov.bt",
    role: "IT Manager",
    status: "active",
    lastLogin: "2024-01-16 09:30",
  },
  {
    id: "2",
    name: "Pema Lhamo",
    email: "pema.l@mit.gov.bt",
    role: "Developer",
    status: "active",
    lastLogin: "2024-01-16 08:45",
  },
  {
    id: "3",
    name: "Karma Dorji",
    email: "karma.d@mit.gov.bt",
    role: "Analyst",
    status: "active",
    lastLogin: "2024-01-15 16:20",
  },
  {
    id: "4",
    name: "Dechen Zangmo",
    email: "dechen.z@mit.gov.bt",
    role: "Administrator",
    status: "inactive",
    lastLogin: "2024-01-12 14:15",
  },
  {
    id: "5",
    name: "Sonam Tshering",
    email: "sonam.t@mit.gov.bt",
    role: "Support",
    status: "active",
    lastLogin: "2024-01-16 10:00",
  },
];

// Column definitions for Super Admin
const superAdminColumns: ColumnDef<SuperAdminData>[] = [
  {
    accessorKey: "organization",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Organization
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("organization")}</div>
    ),
  },
  {
    accessorKey: "users",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Users
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("users")}</div>
    ),
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Revenue
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("revenue"));
      return (
        <div className="text-right font-medium">
          Nu. {amount.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="capitalize">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("lastUpdated")}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit organization</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View users</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Column definitions for Organization Admin
const orgAdminColumns: ColumnDef<OrgAdminData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="capitalize">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("lastLogin")}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Edit user</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Reset password</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface DataTableProps {
  userRole?: "SUPER_ADMIN" | "ORGANIZATION_ADMIN";
}

export function DataTable({ userRole = "ORGANIZATION_ADMIN" }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const data = useMemo(
    () => (isSuperAdmin ? superAdminData : orgAdminData),
    [isSuperAdmin]
  );

  const columns = useMemo(
    () => (isSuperAdmin ? superAdminColumns : orgAdminColumns),
    [isSuperAdmin]
  );

  const table = useReactTable<
    typeof data extends SuperAdminData[] ? SuperAdminData : OrgAdminData
  >({
    data: data as any,
    columns: columns as any,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const getTableTitle = () => {
    return userRole === "SUPER_ADMIN"
      ? "Organization Overview"
      : "Team Members";
  };

  const getSearchPlaceholder = () => {
    return userRole === "SUPER_ADMIN"
      ? "Filter organizations..."
      : "Filter team members...";
  };

  const getFilterColumn = () => {
    return userRole === "SUPER_ADMIN" ? "organization" : "name";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTableTitle()}</CardTitle>
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={getSearchPlaceholder()}
                value={
                  (table
                    .getColumn(getFilterColumn())
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn(getFilterColumn())
                    ?.setFilterValue(event.target.value)
                }
                className="pl-8 max-w-sm"
              />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
