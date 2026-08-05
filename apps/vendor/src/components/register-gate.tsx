"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Textarea } from "@mongkolka/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { getToken, setToken } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import { AuthShell } from "@/components/auth-shell";

interface VendorCategory {
  category_id: string;
  label_en: string;
}

const registerSchema = z
  .object({
    business_name: z.string().min(1, "Business name is required"),
    category_id: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterGate() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { data: categoryData } = useApiQuery<{ categories: VendorCategory[] }>("/public/api/vendor-categories");

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      business_name: "",
      category_id: undefined,
      location: "",
      description: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function onSubmit(values: RegisterValues) {
    try {
      await api.post("/vendor/auth/register", {
        email: values.email,
        password: values.password,
        business_name: values.business_name,
        category_id: values.category_id,
        location: values.location || undefined,
        description: values.description || undefined,
      });
      // Registration doesn't return a session — sign the vendor straight in so
      // they land on the dashboard, which shows a pending-approval notice
      // instead of a dead end.
      const { token } = await api.post<{ token: string }>("/vendor/auth/login", {
        email: values.email,
        password: values.password,
      });
      setToken(token);
      toast.success("Account created — your registration is pending admin approval.");
      router.replace("/dashboard");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create account");
    }
  }

  return (
    <AuthShell
      tagline="Vendor portal"
      headline="Grow your wedding business"
      title="Create your account"
      description="Tell us about your business to get started"
      footer={
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link href="/" className="text-foreground font-medium underline underline-offset-4">
            Sign in
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business name</FormLabel>
                <FormControl>
                  <Input placeholder="Golden Lotus Photography" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category (optional)</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryData?.categories.map((category) => (
                      <SelectItem key={category.category_id} value={category.category_id}>
                        {category.label_en}
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Phnom Penh, Cambodia" {...field} />
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
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type={showPassword ? "text" : "password"} autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <UserPlus />
            Create account
          </Button>
        </form>
      </Form>

      <p className="text-muted-foreground text-center text-xs text-balance">
        An admin reviews every new account. You can sign in right away — your dashboard will show a pending badge
        until it&apos;s approved.
      </p>
    </AuthShell>
  );
}
