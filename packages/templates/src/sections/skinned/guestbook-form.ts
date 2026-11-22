"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { GuestbookResult, GuestbookSubmission } from "../../types";
import { classifyError, validatePhoto, type PhotoErrorKind } from "../grace/guestbook-logic";
import { firstInvalid, formErrors } from "./guestbook-wall-logic";

type Phase = "idle" | "sending" | "done" | "error";

/**
 * Form state for the guest wish + photo. Mirrors the Grace guestbook's behaviour exactly (same
 * validation, same error kinds, same pending/approved outcome) without any JSX or styling.
 */
export function useGuestbookForm(
  invitedName: string | null | undefined,
  onSubmit: (s: GuestbookSubmission) => Promise<GuestbookResult>,
) {
  const [name, setName] = useState((invitedName ?? "").slice(0, 80));
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorKind, setErrorKind] = useState<PhotoErrorKind | null>(null);
  const [pickError, setPickError] = useState<PhotoErrorKind | null>(null);
  const [tried, setTried] = useState(false);
  const [resultStatus, setResultStatus] = useState<GuestbookResult["status"]>("pending");
  const fileRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const wishRef = useRef<HTMLTextAreaElement>(null);
  const photoBtnRef = useRef<HTMLButtonElement>(null);
  const refocus = useRef(false);

  useEffect(() => {
    if (invitedName) setName((n) => n || invitedName.slice(0, 80));
  }, [invitedName]);

  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  useEffect(() => {
    if (phase === "done") doneRef.current?.focus();
    if (phase === "idle" && refocus.current) {
      refocus.current = false;
      (photoBtnRef.current ?? nameRef.current)?.focus();
    }
  }, [phase]);

  const input = { name, message, hasPhoto: !!photo };
  const errors = formErrors(input, tried);

  function pick(file: File | null) {
    if (!file) return;
    const bad = validatePhoto(file);
    if (fileRef.current) fileRef.current.value = "";
    if (bad) {
      // keep any previously chosen valid photo; just explain why the new file was refused
      setPickError(bad);
      return;
    }
    setPickError(null);
    setErrorKind(null);
    setPhase((s) => (s === "error" ? "idle" : s));
    setPhoto(file);
  }

  function removePhoto() {
    setPhoto(null);
    setPickError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (phase === "sending") return;
    setTried(true);
    const bad = firstInvalid(input);
    if (bad === "name") return nameRef.current?.focus();
    if (bad === "wish") return wishRef.current?.focus();
    setPhase("sending");
    setErrorKind(null);
    try {
      const result = await onSubmit({ name: name.trim(), message: message.trim() || undefined, photo: photo ?? undefined });
      setResultStatus(result.status);
      setPhase("done");
    } catch (err) {
      setErrorKind(classifyError(err));
      setPhase("error");
    }
  }

  function reset() {
    setMessage("");
    setPhoto(null);
    setTried(false);
    setErrorKind(null);
    setPickError(null);
    refocus.current = true;
    setPhase("idle");
  }

  return {
    name, setName, message, setMessage, photo, preview, phase, errorKind, pickError, errors, resultStatus,
    refs: { fileRef, doneRef, nameRef, wishRef, photoBtnRef },
    pick, removePhoto, submit, reset,
  };
}
