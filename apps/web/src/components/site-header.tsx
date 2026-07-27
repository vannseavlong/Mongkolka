"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { BrandThemeSwitcher } from "@mongkolka/ui/brand-theme-switcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@mongkolka/ui/sheet";

const COUPLE_URL = process.env.NEXT_PUBLIC_COUPLE_URL ?? "http://localhost:3002";
const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_URL ?? "http://localhost:3003";

const NAV_LINKS = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/templates", label: "Templates" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-5 sm:px-12">
      <Link href="/" className="flex items-center gap-2">
        <Heart className="size-5 text-primary" />
        <span className="text-lg font-medium">Mongkolka</span>
      </Link>

      <nav className="hidden items-center gap-1 md:flex">
        {NAV_LINKS.map((link) => (
          <Button key={link.href} variant="ghost" asChild>
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </nav>

      <div className="hidden items-center gap-2 md:flex">
        <BrandThemeSwitcher />
        <Button variant="ghost" asChild>
          <a href={VENDOR_URL}>For vendors</a>
        </Button>
        <Button asChild>
          <a href={COUPLE_URL}>Start planning</a>
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Mongkolka</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1 px-4">
            {NAV_LINKS.map((link) => (
              <Button key={link.href} variant="ghost" className="justify-start" asChild onClick={() => setOpen(false)}>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
            <div className="my-2 border-t" />
            <Button variant="ghost" className="justify-start" asChild>
              <a href={VENDOR_URL}>For vendors</a>
            </Button>
            <Button className="justify-start" asChild>
              <a href={COUPLE_URL}>Start planning</a>
            </Button>
            <div className="mt-2">
              <BrandThemeSwitcher />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
