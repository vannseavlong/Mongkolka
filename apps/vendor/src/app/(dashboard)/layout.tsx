"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { SWRConfig } from "swr";
import { Clock3, ShieldOff } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@mongkolka/ui/sidebar";
import { Header } from "@mongkolka/ui/layout/header";
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getToken, clearToken } from "@/lib/auth";
import { useApiQuery } from "@/lib/use-api-query";

function subscribeToToken(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getServerToken() {
  return null;
}

interface SessionInfo {
  status: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // useSyncExternalStore, not useState+useEffect, to read the token out of
  // localStorage — it's the React-endorsed way to read an external mutable
  // source during render: `getServerToken` keeps SSR output blank, and React
  // reconciles to the real value right after hydration with no mismatch.
  const token = useSyncExternalStore(subscribeToToken, getToken, getServerToken);

  // The JWT's own `status` claim is a snapshot from login time — it goes
  // stale the moment an admin approves the account, and nothing re-issues
  // the token until the next sign-in. So this asks the backend fresh instead
  // of decoding the token (mirrors requireActiveVendor's own "don't trust
  // the JWT" reasoning on the server side).
  const { data, loading, error } = useApiQuery<SessionInfo>(token ? "/vendor/api/session" : null);

  useEffect(() => {
    if (!token) {
      router.replace("/");
      return;
    }
    if (error) {
      // Invalid/expired token — bounce back to sign in instead of hanging.
      clearToken();
      router.replace("/");
    }
  }, [token, error, router]);

  function signOut() {
    clearToken();
    router.replace("/");
  }

  if (!token || loading || error) return null;

  const status = data?.status ?? "active";

  // Every other /vendor/api endpoint 403s for a non-active account (see
  // requireActiveVendor) — there's no partial dashboard to show, so this
  // replaces the whole shell rather than layering a banner over broken data.
  if (status !== "active") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        {status === "pending" ? (
          <>
            <Badge variant="secondary" className="gap-1.5">
              <Clock3 className="size-3.5" />
              Pending approval
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight">Your account is awaiting approval</h1>
            <p className="text-muted-foreground max-w-sm text-sm">
              An admin needs to review your registration before you can access your dashboard. This usually doesn&apos;t
              take long — check back soon.
            </p>
          </>
        ) : (
          <>
            <Badge variant="destructive" className="gap-1.5">
              <ShieldOff className="size-3.5" />
              Inactive
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight">Your account has been deactivated</h1>
            <p className="text-muted-foreground max-w-sm text-sm">
              Contact support if you believe this is a mistake.
            </p>
          </>
        )}
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </main>
    );
  }

  return (
    <SWRConfig
      value={{
        // Data is already cached client-side by useApiQuery's key; without
        // this, SWR's defaults refetch on every tab/window focus and on
        // every remount (i.e. every time a page is revisited), which is
        // what was hammering the Sheets read quota. Writers call `refetch()`
        // explicitly, so this only stops the *implicit* background refetches.
        revalidateOnFocus: false,
        revalidateIfStale: false,
        dedupingInterval: 5000,
      }}
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header fixed />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </SWRConfig>
  );
}
