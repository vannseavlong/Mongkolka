"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@mongkolka/ui/card";
import { Input } from "@mongkolka/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@mongkolka/ui/alert-dialog";
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import type { CoupleMember } from "../data/schema";

const MEMBERS_KEY = "/couple/api/members";

export function MembersSection() {
  const { data } = useApiQuery<{ members: CoupleMember[] }>(MEMBERS_KEY);
  const [memberToRemove, setMemberToRemove] = useState<CoupleMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  async function removeMember() {
    if (!memberToRemove) return;
    try {
      await api.delete(`${MEMBERS_KEY}/${memberToRemove.member_id}`);
      toast.success("Member removed");
      mutate(MEMBERS_KEY);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to remove member");
    } finally {
      setMemberToRemove(null);
    }
  }

  async function sendInvite() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      await api.post(`${MEMBERS_KEY}/invite`, { email: inviteEmail.trim() });
      toast.success("Invite sent");
      setInviteEmail("");
      mutate(MEMBERS_KEY);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to send invite");
    } finally {
      setInviting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who can manage this account</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {data?.members.map((member) => (
            <div key={member.member_id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">{member.email}</span>
                <Badge variant={member.member_role === "partner" ? "default" : "secondary"}>
                  {member.member_role === "partner" ? "Partner" : "Collaborator"}
                </Badge>
              </div>
              {member.member_role === "collaborator" && (
                <Button variant="outline" size="sm" onClick={() => setMemberToRemove(member)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-end gap-2">
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="invite-email" className="text-sm font-medium">
              Invite partner
            </label>
            <Input
              id="invite-email"
              type="email"
              placeholder="partner@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>
          <Button onClick={sendInvite} disabled={inviting || !inviteEmail.trim()}>
            Send invite
          </Button>
        </div>
      </CardContent>

      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove &ldquo;{memberToRemove?.email}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeMember}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
