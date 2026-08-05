"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mongkolka/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { api, ApiError } from "@/lib/api";
import type { Stat } from "../data/schema";

const statFormSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  icon: z.string().optional(),
  display_order: z.coerce.number().int(),
});

type StatFormValues = z.infer<typeof statFormSchema>;

function defaultFormValues(currentRow?: Stat): StatFormValues {
  if (!currentRow) return { label: "", value: "", icon: "", display_order: 0 };
  return {
    label: currentRow.label,
    value: currentRow.value,
    icon: currentRow.icon ?? "",
    display_order: currentRow.display_order,
  };
}

export function StatsActionDialog({
  open,
  onOpenChange,
  currentRow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Stat;
}) {
  const isEdit = !!currentRow;

  const form = useForm<StatFormValues>({
    resolver: zodResolver(statFormSchema),
    defaultValues: defaultFormValues(currentRow),
  });

  // Re-seed the form whenever the dialog opens (create vs. edit share this
  // component, so a fresh reset is needed each time rather than only on
  // first mount).
  useEffect(() => {
    if (open) {
      form.reset(defaultFormValues(currentRow));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentRow]);

  function handleOpenChange(state: boolean) {
    if (!state) form.reset();
    onOpenChange(state);
  }

  async function onSubmit(values: StatFormValues) {
    try {
      if (isEdit && currentRow) {
        await api.patch(`/admin/api/stats/${currentRow.stat_id}`, values);
        toast.success("Stat updated");
      } else {
        await api.post("/admin/api/stats", values);
        toast.success("Stat created");
      }
      mutate("/admin/api/stats");
      handleOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : `Failed to ${isEdit ? "update" : "create"} stat`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit stat" : "New stat"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="stat-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="Happy Couples" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="10,000+" {...field} />
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
                    <Input placeholder="Heart" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="stat-form" disabled={form.formState.isSubmitting}>
            {isEdit ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
