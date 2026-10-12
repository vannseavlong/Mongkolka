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
import { Checkbox } from "@mongkolka/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { Textarea } from "@mongkolka/ui/textarea";
import { api, ApiError } from "@/lib/api";
import { GIFT_CURRENCIES, GIFT_STATUSES, GIFT_TYPES, GUEST_GROUPS, type Guest } from "../data/schema";

const guestFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  telegram: z.string().optional(),
  phone: z.string().optional(),
  group: z.enum(GUEST_GROUPS).optional(),
  plus_one: z.boolean(),
  plus_one_name: z.string().optional(),
  notes: z.string().optional(),
  gift_status: z.enum(GIFT_STATUSES),
  gift_type: z.enum(GIFT_TYPES).optional(),
  // text in the input; converted to a number on submit
  gift_amount: z.string().optional(),
  gift_currency: z.enum(GIFT_CURRENCIES).optional(),
  gift_note: z.string().optional(),
});

type GuestFormValues = z.infer<typeof guestFormSchema>;

export function GuestsActionDialog({
  open,
  onOpenChange,
  currentRow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Guest;
}) {
  const isEdit = !!currentRow;

  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name: currentRow?.name ?? "",
      telegram: currentRow?.telegram ?? "",
      phone: currentRow?.phone ?? "",
      group: currentRow?.group ?? undefined,
      plus_one: currentRow?.plus_one ?? false,
      plus_one_name: currentRow?.plus_one_name ?? "",
      notes: currentRow?.notes ?? "",
      gift_status: currentRow?.gift_status ?? "none",
      gift_type: currentRow?.gift_type ?? "cash",
      gift_amount: currentRow?.gift_amount ? String(currentRow.gift_amount) : "",
      gift_currency: currentRow?.gift_currency ?? "USD",
      gift_note: currentRow?.gift_note ?? "",
    },
  });

  const plusOne = form.watch("plus_one");
  const giftStatus = form.watch("gift_status");
  const giftType = form.watch("gift_type");

  function handleOpenChange(state: boolean) {
    if (!state) form.reset();
    onOpenChange(state);
  }

  async function onSubmit(values: GuestFormValues) {
    const { gift_amount, ...rest } = values;
    const payload = {
      ...rest,
      gift_amount: values.gift_status === "none" ? 0 : Number(gift_amount) || 0,
    };
    try {
      if (isEdit) {
        await api.patch(`/couple/api/guests/${currentRow.guest_id}`, payload);
        toast.success("Guest updated");
      } else {
        await api.post("/couple/api/guests", payload);
        toast.success("Guest added");
      }
      mutate("/couple/api/guests");
      handleOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save guest");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit guest" : "Add guest"}</DialogTitle>
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
                    <Input placeholder="Sok Dara" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram</FormLabel>
                    <FormControl>
                      <Input placeholder="@handle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group</FormLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose…" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GUEST_GROUPS.map((g) => (
                        <SelectItem key={g} value={g} className="capitalize">
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plus_one"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">Bringing a plus one</FormLabel>
                </FormItem>
              )}
            />
            {plusOne && (
              <FormField
                control={form.control}
                name="plus_one_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plus one name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <fieldset className="rounded-lg border p-4">
              <legend className="px-1 text-sm font-medium">Wedding gift</legend>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="gift_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No gift yet</SelectItem>
                          <SelectItem value="reported">Reported by guest — to confirm</SelectItem>
                          <SelectItem value="received">Received</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {giftStatus !== "none" && (
                  <>
                    <FormField
                      control={form.control}
                      name="gift_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select value={field.value ?? "cash"} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cash">Cash / transfer</SelectItem>
                              <SelectItem value="gift">Gift item</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    {giftType !== "gift" && (
                      <div className="grid grid-cols-[1fr_8rem] gap-3">
                        <FormField
                          control={form.control}
                          name="gift_amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input type="number" min={0} step="any" inputMode="decimal" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gift_currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <Select value={field.value ?? "USD"} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="USD">$ USD</SelectItem>
                                  <SelectItem value="KHR">៛ KHR</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    <FormField
                      control={form.control}
                      name="gift_note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note</FormLabel>
                          <FormControl>
                            <Input placeholder={giftType === "gift" ? "What did they give?" : "e.g. envelope at the door"} {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </fieldset>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEdit ? "Save" : "Add guest"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
