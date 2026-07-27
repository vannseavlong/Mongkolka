import Link from "next/link";
import { Heart } from "lucide-react";

const NAV_LINKS = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/templates", label: "Templates" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t px-6 py-8 sm:px-12">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="size-4 text-primary" />
          <span className="text-sm font-medium">Mongkolka</span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} Mongkolka</span>
      </div>
    </footer>
  );
}
