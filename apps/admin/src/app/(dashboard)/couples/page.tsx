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
import type { Couple } from "@/lib/types";

const STATUS_VARIANT: Record<Couple["status"], "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  active: "default",
  suspended: "destructive",
  rejected: "destructive",
};

export default function CouplesPage() {
  const { data, loading, error, refetch } = useApiQuery<{ couples: Couple[] }>(
    "/admin/api/couples",
  );

  async function toggle(couple: Couple) {
    const action = couple.status === "active" ? "suspend" : "reactivate";
    try {
      await api.post(`/admin/api/couples/${couple.couple_id}/${action}`);
      toast.success(action === "suspend" ? "Suspended" : "Reactivated");
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update couple");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium">Couples</h1>
      {error && <p className="text-destructive">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Partner 1</TableHead>
            <TableHead>Partner 2</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Wedding date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Website</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading && (data?.couples.length ?? 0) === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No couples yet.
              </TableCell>
            </TableRow>
          )}
          {data?.couples.map((couple) => (
            <TableRow key={couple.couple_id}>
              <TableCell>{couple.partner1_name ?? couple.partner1_email}</TableCell>
              <TableCell>{couple.partner2_name ?? couple.partner2_email ?? "—"}</TableCell>
              <TableCell className="font-mono text-sm">{couple.slug}</TableCell>
              <TableCell>
                {couple.wedding_date ? new Date(couple.wedding_date).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[couple.status]} className="capitalize">
                  {couple.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {couple.website_status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant={couple.status === "active" ? "outline" : "default"}
                  onClick={() => toggle(couple)}
                >
                  {couple.status === "active" ? "Suspend" : "Reactivate"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
