import Link from "next/link";
import { Heart } from "lucide-react";
import { COUPLE_URL, VENDOR_URL } from "@/lib/app-urls";

const EXPLORE_LINKS = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/templates", label: "Templates" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-deep px-5 py-14 text-primary-foreground sm:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href="/" className="mb-4 flex items-center gap-2">
            <Heart className="size-5 text-brand-gold" />
            <span className="font-display text-2xl font-medium">Mongkolka</span>
          </Link>
          <p className="text-sm text-primary-foreground/70">
            Wedding planning and beautiful wedding websites, made for couples in Cambodia.
          </p>
        </div>

        <nav aria-label="Explore" className="flex flex-col gap-2.5 text-sm">
          <span className="mb-1 text-xs tracking-[0.2em] text-brand-gold uppercase">Explore</span>
          {EXPLORE_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-primary-foreground/75 hover:text-primary-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Get started" className="flex flex-col gap-2.5 text-sm">
          <span className="mb-1 text-xs tracking-[0.2em] text-brand-gold uppercase">Get started</span>
          <a href={COUPLE_URL} className="text-primary-foreground/75 hover:text-primary-foreground">
            Start planning
          </a>
          <a href={VENDOR_URL} className="text-primary-foreground/75 hover:text-primary-foreground">
            List your business
          </a>
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} Mongkolka. Made with love in Cambodia.
      </div>
    </footer>
  );
}
