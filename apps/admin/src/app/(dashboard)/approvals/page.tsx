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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@mongkolka/ui/alert-dialog";
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import type { User } from "@/lib/types";

export default function ApprovalsPage() {
  const { data, loading, error, refetch } = useApiQuery<{ users: User[] }>(
    "/admin/api/users?status=pending",
  );

  const pending = (data?.users ?? []).filter((u) => u.role === "couple" || u.role === "vendor");

  async function approve(userId: string) {
    try {
      await api.post(`/admin/api/users/${userId}/approve`);
      toast.success("Approved");
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to approve");
    }
  }

  async function reject(userId: string) {
    try {
      await api.post(`/admin/api/users/${userId}/reject`);
      toast.success("Rejected");
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to reject");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium">Approvals</h1>
      {error && <p className="text-destructive">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading && pending.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No pending approvals.
              </TableCell>
            </TableRow>
          )}
          {pending.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>{new Date(user._created_at).toLocaleDateString()}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button size="sm" onClick={() => approve(user.user_id)}>
                  Approve
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reject {user.email}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This marks their account as inactive. They can be approved again later.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => reject(user.user_id)}>
                        Reject
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
