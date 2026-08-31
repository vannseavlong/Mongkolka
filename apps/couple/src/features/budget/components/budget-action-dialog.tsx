"use client";

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
import type { BudgetCategory } from "../data/schema";

const budgetCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // "spent" isn't set here — it's derived server-side from the checklist
  // tasks linked to this category (see CoupleBudgetService.withComputedSpent).
  allocated: z.coerce.number().min(0),
  color: z.string().optional(),
});

type BudgetCategoryFormValues = z.infer<typeof budgetCategoryFormSchema>;

export function BudgetActionDialog({
  open,
  onOpenChange,
  currentRow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: BudgetCategory;
}) {
  const isEdit = !!currentRow;

  const form = useForm<BudgetCategoryFormValues>({
    resolver: zodResolver(budgetCategoryFormSchema),
    defaultValues: {
      name: currentRow?.name ?? "",
      allocated: currentRow?.allocated ?? 0,
      color: currentRow?.color ?? "#c9a35c",
    },
  });

  function handleOpenChange(state: boolean) {
    if (!state) form.reset();
    onOpenChange(state);
  }

  async function onSubmit(values: BudgetCategoryFormValues) {
    try {
      if (isEdit) {
        await api.patch(`/couple/api/budget-categories/${currentRow.category_id}`, values);
        toast.success("Category updated");
      } else {
        await api.post("/couple/api/budget-categories", values);
        toast.success("Category added");
      }
      mutate("/couple/api/budget-categories");
      handleOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save category");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit category" : "Add category"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Venue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allocated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allocated</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEdit ? "Save" : "Add category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
