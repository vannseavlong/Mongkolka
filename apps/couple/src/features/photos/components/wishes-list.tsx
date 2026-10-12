"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, EyeOff, Gift, Trash2 } from "lucide-react";
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import { api, ApiError } from "@/lib/api";
import { mutate } from "swr";
import type { PhotoStatus, Wish } from "../data/schema";

const STATUS_STYLES: Record<PhotoStatus, string> = {
  pending: "bg-amber-100 text-amber-900 hover:bg-amber-100",
  approved: "bg-emerald-100 text-emerald-900 hover:bg-emerald-100",
  hidden: "bg-muted text-muted-foreground hover:bg-muted",
};

function giftLabel(amount: number, currency: string | null) {
  return currency === "KHR"
    ? `${Math.round(amount).toLocaleString()} ៛`
    : `$${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function WishesList({
  wishes,
  photoUrls,
  onChanged,
}: {
  wishes: Wish[];
  photoUrls: Map<string, string>;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  async function run(id: string, action: () => Promise<unknown>, success: string) {
    setBusy(id);
    try {
      await action();
      toast.success(success);
      onChanged();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  if (wishes.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
        No wishes yet. They&apos;ll appear here as guests write them on your website.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {wishes.map((w) => {
        const photo = w.photo_id ? photoUrls.get(w.photo_id) : undefined;
        return (
          <li key={w.wish_id} className="flex gap-4 rounded-xl border bg-card p-4">
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="size-20 shrink-0 rounded-lg object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-medium">{w.name}</p>
                <Badge className={STATUS_STYLES[w.status]}>{w.queued ? "saving…" : w.status}</Badge>
              </div>
              {w.message && <p className="mt-1 text-sm">&ldquo;{w.message}&rdquo;</p>}
              {w.gift_amount > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <Gift className="size-4 text-muted-foreground" />
                  <span>
                    Says they&apos;re sending <strong>{giftLabel(w.gift_amount, w.gift_currency)}</strong>
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === w.wish_id || w.queued}
                    onClick={() =>
                      run(
                        w.wish_id,
                        async () => {
                          await api.post(`/couple/api/wishes/${w.wish_id}/record-gift`);
                          await mutate("/couple/api/guests");
                        },
                        "Gift recorded on the guest list",
                      )
                    }
                  >
                    Confirm &amp; record
                  </Button>
                </div>
              )}
              <div className="mt-2 flex gap-1">
                {w.status !== "approved" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy === w.wish_id}
                    onClick={() =>
                      run(w.wish_id, () => api.patch(`/couple/api/wishes/${w.wish_id}`, { status: "approved" }), "Wish approved")
                    }
                  >
                    <Check className="size-4" /> Approve
                  </Button>
                )}
                {w.status !== "hidden" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy === w.wish_id}
                    onClick={() =>
                      run(w.wish_id, () => api.patch(`/couple/api/wishes/${w.wish_id}`, { status: "hidden" }), "Wish hidden")
                    }
                  >
                    <EyeOff className="size-4" /> Hide
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busy === w.wish_id}
                  onClick={() => run(w.wish_id, () => api.delete(`/couple/api/wishes/${w.wish_id}`), "Wish deleted")}
                >
                  <Trash2 className="size-4" /> Delete
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
