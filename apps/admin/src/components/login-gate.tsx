"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Alert, AlertDescription } from "@mongkolka/ui/alert";
import { getToken, setToken } from "@/lib/auth";
import { api, ApiError, googleLoginUrl } from "@/lib/api";
import { AuthShell } from "@/components/auth-shell";
import { GoogleIcon } from "@/components/google-icon";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type SignInValues = z.infer<typeof signInSchema>;

export function LoginGate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [googleOnlyNotice, setGoogleOnlyNotice] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setToken(token);
      router.replace("/dashboard");
      return;
    }
    if (getToken()) {
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  async function onSubmit(values: SignInValues) {
    setGoogleOnlyNotice(false);
    try {
      const { token } = await api.post<{ token: string }>("/admin/auth/login", values);
      setToken(token);
      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.code === "google_only") {
        setGoogleOnlyNotice(true);
        return;
      }
      toast.error(err instanceof ApiError ? err.message : "Failed to sign in");
    }
  }

  return (
    <AuthShell
      tagline="Admin portal"
      headline="Run the platform with confidence"
      title="Sign in"
      description="Access your Mongkolka admin portal"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={() => setGoogleOnlyNotice(false)}
          className="flex flex-col gap-4"
        >
          {googleOnlyNotice && (
            <Alert>
              <AlertDescription>This user is authenticated with Google login.</AlertDescription>
            </Alert>
          )}
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
                      autoComplete="current-password"
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <LogIn />
            Sign in
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">Or continue with</span>
        </div>
      </div>

      <Button variant="outline" asChild>
        <a href={googleLoginUrl}>
          <GoogleIcon className="size-4" />
          Continue with Google
        </a>
      </Button>

      <p className="text-muted-foreground text-center text-xs text-balance">
        By continuing, you agree to our Terms of Use and Privacy Policy. Access is restricted to authorised admin
        accounts only.
      </p>
    </AuthShell>
  );
}
