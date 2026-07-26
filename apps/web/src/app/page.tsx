import { Heart, PenLine, Palette, Send } from "lucide-react";
import { Button } from "@mongkolka/ui/button";

const COUPLE_URL = process.env.NEXT_PUBLIC_COUPLE_URL ?? "http://localhost:3002";
const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_URL ?? "http://localhost:3003";

const STEPS = [
  {
    icon: PenLine,
    title: "Plan together",
    description: "Guests, budget, checklist, and countdown milestones — shared with your partner.",
  },
  {
    icon: Palette,
    title: "Design your website",
    description: "Pick a template, adjust the colors, and choose how each section looks.",
  },
  {
    icon: Send,
    title: "Invite your guests",
    description: "Share a personalized link, in English or Khmer, and collect RSVPs as they arrive.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-12">
        <div className="flex items-center gap-2">
          <Heart className="size-5 text-primary" />
          <span className="text-lg font-medium">Mongkolka</span>
        </div>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <a href={VENDOR_URL}>For vendors</a>
          </Button>
          <Button asChild>
            <a href={COUPLE_URL}>Start planning</a>
          </Button>
        </nav>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <h1 className="max-w-2xl text-4xl font-medium tracking-tight sm:text-5xl">
          Plan your wedding, then share a website your guests will love.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Guests, budget, checklist, and a fully customizable wedding website — all in one place for
          couples in Cambodia.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <a href={COUPLE_URL}>Start planning for free</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href={VENDOR_URL}>List your business</a>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 px-6 py-16 sm:grid-cols-3 sm:px-12">
        {STEPS.map((step) => (
          <div key={step.title} className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <step.icon className="size-5 text-primary" />
            </div>
            <h2 className="text-lg font-medium">{step.title}</h2>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </section>

      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Mongkolka
      </footer>
    </main>
  );
}
