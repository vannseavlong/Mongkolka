"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { Input } from "@mongkolka/ui/input";
import { Textarea } from "@mongkolka/ui/textarea";
import { API_URL } from "@/lib/api";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(`${API_URL}/public/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-name" className="text-sm font-medium">
          Your Name
        </label>
        <Input
          id="contact-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className="text-sm font-medium">
          Your Email
        </label>
        <Input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-subject" className="text-sm font-medium">
          Subject
        </label>
        <Input
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="How can we help?"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Your Message
        </label>
        <Textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us more…"
          rows={6}
          required
        />
      </div>

      {status === "success" && (
        <p className="rounded-lg bg-muted px-4 py-3 text-sm text-foreground">
          Thanks — your message has been sent. We&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Something went wrong sending your message. Please try again.
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="w-full bg-gradient-to-r from-primary to-accent"
      >
        <Send className="size-4" />
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
