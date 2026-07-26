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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import { WEBSITE_SECTIONS, type SectionComponent } from "@/features/section-components/data/schema";

const siteTemplateFormSchema = z.object({
  template_id: z
    .string()
    .min(1, "Template ID is required")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
  name: z.string().min(1, "Name is required"),
  default_theme: z.object({
    bg_color: z.string().min(1),
    text_color: z.string().min(1),
    accent_color: z.string().min(1),
    font_style: z.string().min(1),
  }),
  default_components: z.record(z.string(), z.string()),
});

type SiteTemplateFormValues = z.infer<typeof siteTemplateFormSchema>;

export function SiteTemplatesActionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: componentData } = useApiQuery<{ components: SectionComponent[] }>(
    "/admin/api/section-components",
  );

  const form = useForm<SiteTemplateFormValues>({
    resolver: zodResolver(siteTemplateFormSchema),
    defaultValues: {
      template_id: "",
      name: "",
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

  async function onSubmit(values: SiteTemplateFormValues) {
    try {
      await api.post("/admin/api/site-templates", values);
      toast.success("Template created");
      mutate("/admin/api/site-templates");
      handleOpenChange(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create template");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>New site template</DialogTitle>
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
                    <Input placeholder="botanical_romance" {...field} />
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
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="site-template-form" disabled={form.formState.isSubmitting}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
