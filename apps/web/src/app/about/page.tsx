import { Heart, Palette, Store } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const VALUES = [
  {
    icon: Heart,
    title: "Every love story, celebrated",
    text: "Planning a wedding should be joyful, not overwhelming. We keep the tools simple so you can focus on the celebration.",
  },
  {
    icon: Palette,
    title: "A website that's really yours",
    text: "Pick a template, adjust the colors, and share it in English or Khmer — your wedding website, built around your story.",
  },
  {
    icon: Store,
    title: "Trusted local vendors",
    text: "Photographers, venues, salons, and more — a marketplace built for couples planning a wedding in Cambodia.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="flex flex-col gap-4 px-6 py-16 sm:px-12">
        <h1 className="max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">About Mongkolka</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Mongkolka helps couples in Cambodia plan their wedding and share a beautiful website with their
          guests — and helps local wedding vendors get discovered.
        </p>
      </section>

      <section className="flex flex-col gap-4 px-6 pb-8 sm:px-12">
        <h2 className="text-xl font-medium">What we&apos;re building</h2>
        <p className="max-w-2xl text-muted-foreground">
          A guest list, budget tracker, checklist, and countdown milestones for couples to plan together — plus
          a customizable wedding website they can share with friends and family. A marketplace connects couples
          with wedding vendors, and vendors get a simple way to list their services and portfolio.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-8 px-6 py-16 sm:grid-cols-3 sm:px-12">
        {VALUES.map((value) => (
          <div key={value.title} className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <value.icon className="size-5 text-primary" />
            </div>
            <h3 className="font-medium">{value.title}</h3>
            <p className="text-sm text-muted-foreground">{value.text}</p>
          </div>
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
