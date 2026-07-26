"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@mongkolka/ui/button";
import { getToken, setToken } from "@/lib/auth";
import { googleLoginUrl } from "@/lib/api";

export function LoginGate() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-medium">Mongkolka Admin</h1>
      <p className="text-muted-foreground">Sign in with your admin Google account to continue.</p>
      <Button asChild size="lg">
        <a href={googleLoginUrl}>Sign in with Google</a>
      </Button>
    </main>
  );
}
