"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mongkolka/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Switch } from "@mongkolka/ui/switch";
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
import type { VendorCategory } from "@/lib/types";

const categorySchema = z.object({
  key: z
    .string()
    .min(1, "Key is required")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
  label_en: z.string().min(1, "English label is required"),
  label_kh: z.string().optional(),
  icon: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function VendorCategoriesPage() {
  const { data, loading, error, refetch } = useApiQuery<{ categories: VendorCategory[] }>(
    "/admin/api/vendor-categories",
  );
  const [open, setOpen] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { key: "", label_en: "", label_kh: "", icon: "" },
  });

  async function onSubmit(values: CategoryFormValues) {
    try {
      await api.post("/admin/api/vendor-categories", values);
      toast.success("Category created");
      form.reset();
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create category");
    }
  }

  async function toggleActive(category: VendorCategory) {
    try {
      await api.patch(`/admin/api/vendor-categories/${category.category_id}`, {
        active: !category.active,
      });
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update category");
    }
  }

  async function remove(category: VendorCategory) {
    try {
      await api.delete(`/admin/api/vendor-categories/${category.category_id}`);
      toast.success("Category deleted");
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete category");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Vendor categories</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New vendor category</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key</FormLabel>
                      <FormControl>
                        <Input placeholder="photographer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="label_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label (English)</FormLabel>
                      <FormControl>
                        <Input placeholder="Photographer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="label_kh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label (Khmer)</FormLabel>
                      <FormControl>
                        <Input placeholder="អ្នកថតរូប" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon (lucide-react name)</FormLabel>
                      <FormControl>
                        <Input placeholder="Camera" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>English</TableHead>
            <TableHead>Khmer</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading && (data?.categories.length ?? 0) === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No categories yet.
              </TableCell>
            </TableRow>
          )}
          {data?.categories.map((category) => (
            <TableRow key={category.category_id}>
              <TableCell className="font-mono text-sm">{category.key}</TableCell>
              <TableCell>{category.label_en}</TableCell>
              <TableCell>{category.label_kh ?? "—"}</TableCell>
              <TableCell>
                <Switch checked={category.active} onCheckedChange={() => toggleActive(category)} />
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={() => remove(category)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!loading && data?.categories.some((c) => !c.active) && (
        <Badge variant="secondary" className="w-fit">
          Inactive categories are hidden from new vendor registrations
        </Badge>
      )}
    </div>
  );
}
