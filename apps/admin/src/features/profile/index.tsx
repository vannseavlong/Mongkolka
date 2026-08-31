"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@mongkolka/ui/card";
import { Badge } from "@mongkolka/ui/badge";
import { Main } from "@mongkolka/ui/layout/main";
import { getToken, decodeSessionUser } from "@/lib/auth";

function subscribeToToken(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getServerToken() {
  return null;
}

export function Profile() {
  // Same useSyncExternalStore + getServerToken split used in the dashboard
  // layout: keeps SSR output blank and lets React reconcile to the real
  // localStorage value right after hydration with no mismatch.
  const token = useSyncExternalStore(subscribeToToken, getToken, getServerToken);
  const user = useMemo(() => (token ? decodeSessionUser(token) : null), [token]);

  return (
    <Main>
      <div className="flex max-w-lg flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">Account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Email</span>
              <span className="text-sm">{user?.email ?? "—"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Role</span>
              <span className="text-sm capitalize">{user?.role ?? "—"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Status</span>
              {user ? (
                <Badge variant={user.status === "active" ? "secondary" : "destructive"} className="w-fit capitalize">
                  {user.status}
                </Badge>
              ) : (
                <span className="text-sm">—</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  );
}
