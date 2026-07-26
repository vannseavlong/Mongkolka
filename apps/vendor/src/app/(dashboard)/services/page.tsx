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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mongkolka/ui/select";
import { Textarea } from "@mongkolka/ui/textarea";
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
import type { Service } from "@/lib/types";

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  unit: z.enum(["per_event", "per_hour", "package"]),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function ServicesPage() {
  const { data, loading, error, refetch } = useApiQuery<{ services: Service[] }>(
    "/vendor/api/services",
  );
  const [open, setOpen] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { name: "", description: "", price: undefined, unit: "per_event" },
  });

  async function onSubmit(values: ServiceFormValues) {
    try {
      await api.post("/vendor/api/services", values);
      toast.success("Service added");
      form.reset();
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to add service");
    }
  }

  async function remove(service: Service) {
    try {
      await api.delete(`/vendor/api/services/${service.service_id}`);
      toast.success("Service removed");
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to remove service");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Services</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add service</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New service</DialogTitle>
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
                        <Input placeholder="Full day wedding photography" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (USD)</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="per_event">Per event</SelectItem>
                            <SelectItem value="per_hour">Per hour</SelectItem>
                            <SelectItem value="package">Package</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading && (data?.services.length ?? 0) === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No services yet.
              </TableCell>
            </TableRow>
          )}
          {data?.services.map((service) => (
            <TableRow key={service.service_id}>
              <TableCell>
                <div>{service.name}</div>
                {service.description && (
                  <div className="text-sm text-muted-foreground">{service.description}</div>
                )}
              </TableCell>
              <TableCell>{service.price != null ? `$${service.price}` : "—"}</TableCell>
              <TableCell>
                <Badge variant="outline">{service.unit.replace("_", " ")}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={() => remove(service)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
