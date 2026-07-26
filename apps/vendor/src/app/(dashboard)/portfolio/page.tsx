"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@mongkolka/ui/card";
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
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import type { PortfolioItem } from "@/lib/types";

const itemSchema = z.object({
  image_url: z.string().url("Must be a valid URL"),
  caption: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function PortfolioPage() {
  const { data, loading, error, refetch } = useApiQuery<{ items: PortfolioItem[] }>(
    "/vendor/api/portfolio",
  );
  const [open, setOpen] = useState(false);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { image_url: "", caption: "" },
  });

  async function onSubmit(values: ItemFormValues) {
    try {
      await api.post("/vendor/api/portfolio", values);
      toast.success("Photo added");
      form.reset();
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to add photo");
    }
  }

  async function remove(item: PortfolioItem) {
    try {
      await api.delete(`/vendor/api/portfolio/${item.item_id}`);
      toast.success("Photo removed");
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to remove photo");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Portfolio</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add photo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add portfolio photo</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caption</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    Add
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-destructive">{error}</p>}
      {!loading && (data?.items.length ?? 0) === 0 && (
        <p className="text-muted-foreground">No photos yet.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data?.items.map((item) => (
          <Card key={item.item_id} className="overflow-hidden py-0">
            <CardContent className="p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- external, arbitrary vendor-supplied URLs */}
              <img src={item.image_url} alt={item.caption ?? ""} className="aspect-square w-full object-cover" />
            </CardContent>
            <CardFooter className="flex items-center justify-between py-3">
              <span className="truncate text-sm text-muted-foreground">{item.caption ?? "—"}</span>
              <Button size="icon" variant="ghost" onClick={() => remove(item)}>
                <Trash2 className="size-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
