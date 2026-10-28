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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Textarea } from "@mongkolka/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import { ROOT_DOMAIN } from "@/lib/site-url";
import type { SiteTemplate } from "../data/schema";
import { WEBSITE_SECTIONS, type SectionComponent } from "@/features/section-components/data/schema";

const siteTemplateFormSchema = z.object({
  template_id: z
    .string()
    .min(1, "Template ID is required")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
  name: z.string().min(1, "Name is required"),
  // Mirrors isValidCustomSlug in apps/api/src/utils/slug.ts; the API also
  // rejects reserved words and duplicates, shown inline after submit.
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Slug must be at least 3 characters")
    .max(40, "Slug must be at most 40 characters")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase letters and numbers, with single hyphens between"),
  description: z.string().trim().max(500, "Description must be at most 500 characters"),
  default_theme: z.object({
    bg_color: z.string().min(1),
    text_color: z.string().min(1),
    accent_color: z.string().min(1),
    font_style: z.string().min(1),
  }),
  // Legacy rows may have no entry (or a null/empty one) for some sections.
  default_components: z.record(z.string(), z.string().nullish()),
});

type SiteTemplateFormValues = z.infer<typeof siteTemplateFormSchema>;

export function SiteTemplatesActionDialog({
  open,
  onOpenChange,
  currentRow,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: SiteTemplate;
}) {
  const isEdit = !!currentRow;
  const { data: componentData } = useApiQuery<{ components: SectionComponent[] }>(
    "/admin/api/section-components",
  );

  const form = useForm<SiteTemplateFormValues>({
    resolver: zodResolver(siteTemplateFormSchema),
    defaultValues: currentRow
      ? {
          template_id: currentRow.template_id,
          name: currentRow.name,
          slug: currentRow.slug ?? "",
          description: currentRow.description ?? "",
          default_theme: currentRow.default_theme,
          default_components: currentRow.default_components,
        }
      : {
          template_id: "",
          name: "",
          slug: "",
          description: "",
          default_theme: {
            bg_color: "#ffffff",
            text_color: "#111111",
            accent_color: "#c9a35c",
            font_style: "serif",
          },
          default_components: {},
        },
  });

  function handleOpenChange(state: boolean) {
    if (!state) form.reset();
    onOpenChange(state);
  }

  async function onSubmit(rawValues: SiteTemplateFormValues) {
    // Drop sections with no component chosen so the API only gets real ids.
    const values = {
      ...rawValues,
      default_components: Object.fromEntries(
        Object.entries(rawValues.default_components).filter(([, v]) => !!v),
      ) as Record<string, string>,
    };
    try {
      if (currentRow) {
        await api.patch(`/admin/api/site-templates/${currentRow.template_id}`, {
          name: values.name,
          slug: values.slug,
          description: values.description,
          default_theme: values.default_theme,
          default_components: values.default_components,
        });
        toast.success("Template updated");
      } else {
        await api.post("/admin/api/site-templates", values);
        toast.success("Template created");
      }
      mutate("/admin/api/site-templates");
      handleOpenChange(false);
    } catch (err) {
      // 400 (bad format / reserved word) and 409 (duplicate slug) are shown
      // under the slug field; anything else falls back to a toast.
      if (err instanceof ApiError && (err.status === 400 || err.status === 409)) {
        // Only slug problems belong under the slug field; others go to a form-level message.
        if (/slug/i.test(err.message)) form.setError("slug", { type: "server", message: err.message });
        else form.setError("root", { type: "server", message: err.message });
        return;
      }
      toast.error(
        err instanceof ApiError ? err.message : `Failed to ${isEdit ? "update" : "create"} template`,
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit site template" : "New site template"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="site-template-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="template_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template ID</FormLabel>
                  <FormControl>
                    <Input placeholder="botanical_romance" disabled={isEdit} {...field} />
                  </FormControl>
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
                    <Input placeholder="Botanical Romance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="botanical-romance" autoComplete="off" {...field} />
                  </FormControl>
                  <FormDescription>
                    Preview URL: {field.value || "your-slug"}.{ROOT_DOMAIN}
                  </FormDescription>
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
                    <Textarea rows={3} placeholder="Short summary shown to couples" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="default_theme.bg_color"
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
                name="default_theme.text_color"
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
                name="default_theme.accent_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accent</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="default_theme.font_style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font style</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="sans">Sans</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <p className="text-sm font-medium">Default component per section</p>
            <div className="grid grid-cols-2 gap-4">
              {WEBSITE_SECTIONS.map((section) => (
                <FormField
                  key={section}
                  control={form.control}
                  name={`default_components.${section}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{section}</FormLabel>
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {componentData?.components
                            .filter((c) => c.section === section)
                            .map((c) => (
                              <SelectItem key={c.component_id} value={c.component_id}>
                                {c.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            {form.formState.errors.root?.message && (
              <p role="alert" className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="site-template-form" disabled={form.formState.isSubmitting}>
            {isEdit ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
