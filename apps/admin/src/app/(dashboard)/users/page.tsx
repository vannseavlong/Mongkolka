"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import { Input } from "@mongkolka/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mongkolka/ui/select";
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
import type { User } from "@/lib/types";

const STATUS_VARIANT: Record<User["status"], "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  active: "default",
  inactive: "destructive",
};

export default function UsersPage() {
  const { data, loading, error, refetch } = useApiQuery<{ users: User[] }>("/admin/api/users");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return (data?.users ?? []).filter((user) => {
      if (roleFilter !== "all" && user.role !== roleFilter) return false;
      if (search && !user.email.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [data, search, roleFilter]);

  async function toggleStatus(user: User) {
    const action = user.status === "active" ? "reject" : "approve";
    try {
      await api.post(`/admin/api/users/${user.user_id}/${action}`);
      toast.success(action === "reject" ? "Deactivated" : "Activated");
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update user");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium">All users</h1>
      {error && <p className="text-destructive">{error}</p>}

      <div className="flex gap-4">
        <Input
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="couple">Couple</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading && filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No users found.
              </TableCell>
            </TableRow>
          )}
          {filtered.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[user.status]} className="capitalize">
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(user._created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                {user.role !== "admin" && (
                  <Button
                    size="sm"
                    variant={user.status === "active" ? "outline" : "default"}
                    onClick={() => toggleStatus(user)}
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
