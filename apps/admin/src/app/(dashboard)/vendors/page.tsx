"use client";

import { toast } from "sonner";
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@mongkolka/ui/table";
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import type { Vendor, VendorCategory } from "@/lib/types";

const STATUS_VARIANT: Record<Vendor["status"], "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  active: "default",
  inactive: "destructive",
  rejected: "destructive",
};

export default function VendorsPage() {
  const { data, loading, error, refetch } = useApiQuery<{ vendors: Vendor[] }>(
    "/admin/api/vendors",
  );
  const { data: categoryData } = useApiQuery<{ categories: VendorCategory[] }>(
    "/admin/api/vendor-categories",
  );
  const categoryLabel = (categoryId: string | null) =>
    categoryData?.categories.find((c) => c.category_id === categoryId)?.label_en ?? "—";

  async function toggle(vendor: Vendor) {
    const action = vendor.status === "active" ? "suspend" : "reactivate";
    try {
      await api.post(`/admin/api/vendors/${vendor.vendor_id}/${action}`);
      toast.success(action === "suspend" ? "Suspended" : "Reactivated");
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update vendor");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium">Vendors</h1>
      {error && <p className="text-destructive">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business</TableHead>
            <TableHead>Owner email</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading && (data?.vendors.length ?? 0) === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No vendors yet.
              </TableCell>
            </TableRow>
          )}
          {data?.vendors.map((vendor) => (
            <TableRow key={vendor.vendor_id}>
              <TableCell>{vendor.business_name ?? "—"}</TableCell>
              <TableCell>{vendor.owner_email}</TableCell>
              <TableCell>{categoryLabel(vendor.category_id)}</TableCell>
              <TableCell>{vendor.location ?? "—"}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[vendor.status]} className="capitalize">
                  {vendor.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant={vendor.status === "active" ? "outline" : "default"}
                  onClick={() => toggle(vendor)}
                >
                  {vendor.status === "active" ? "Suspend" : "Reactivate"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
