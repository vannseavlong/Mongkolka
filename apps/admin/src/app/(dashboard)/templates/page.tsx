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
import { WEBSITE_SECTIONS, type WebsiteTemplate } from "@/lib/types";

const templateSchema = z.object({
  template_id: z
    .string()
    .min(1, "Template ID is required")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
  section: z.enum(WEBSITE_SECTIONS),
  name: z.string().min(1, "Name is required"),
  preview_bg_color: z.string().optional(),
  preview_text_color: z.string().optional(),
  preview_accent_color: z.string().optional(),
  font_style: z.string().optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export default function TemplatesPage() {
  const { data, loading, error, refetch } = useApiQuery<{ templates: WebsiteTemplate[] }>(
    "/admin/api/website-templates",
  );
  const [open, setOpen] = useState(false);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      template_id: "",
      section: "hero",
      name: "",
      preview_bg_color: "#ffffff",
      preview_text_color: "#111111",
      preview_accent_color: "#ec4899",
      font_style: "sans",
    },
  });

  async function onSubmit(values: TemplateFormValues) {
    try {
      await api.post("/admin/api/website-templates", values);
      toast.success("Template created");
      form.reset();
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create template");
    }
  }

  async function toggleStatus(template: WebsiteTemplate) {
    try {
      await api.patch(`/admin/api/website-templates/${template.template_id}`, {
        status: template.status === "active" ? "inactive" : "active",
      });
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update template");
    }
  }

  async function remove(template: WebsiteTemplate) {
    try {
      await api.delete(`/admin/api/website-templates/${template.template_id}`);
      toast.success("Template deleted");
      refetch();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete template");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Website templates</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add template</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New website template</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="template_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template ID</FormLabel>
                      <FormControl>
                        <Input placeholder="hero_elegant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {WEBSITE_SECTIONS.map((section) => (
                            <SelectItem key={section} value={section}>
                              {section}
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display name</FormLabel>
                      <FormControl>
                        <Input placeholder="Elegant" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="preview_bg_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background</FormLabel>
                        <FormControl>
                          <Input type="color" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preview_text_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Text</FormLabel>
                        <FormControl>
                          <Input type="color" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preview_accent_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accent</FormLabel>
                        <FormControl>
                          <Input type="color" {...field} />
                        </FormControl>
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
            <TableHead>Preview</TableHead>
            <TableHead>Template ID</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading && (data?.templates.length ?? 0) === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No templates yet.
              </TableCell>
            </TableRow>
          )}
          {data?.templates.map((template) => (
            <TableRow key={template.template_id}>
              <TableCell>
                <div
                  className="size-8 rounded-full border"
                  style={{
                    backgroundColor: template.preview_bg_color ?? undefined,
                    borderColor: template.preview_accent_color ?? undefined,
                  }}
                />
              </TableCell>
              <TableCell className="font-mono text-sm">{template.template_id}</TableCell>
              <TableCell>
                <Badge variant="outline">{template.section}</Badge>
              </TableCell>
              <TableCell>{template.name}</TableCell>
              <TableCell>
                <Switch
                  checked={template.status === "active"}
                  onCheckedChange={() => toggleStatus(template)}
                />
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={() => remove(template)}>
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
