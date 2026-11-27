"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { COUPLE_URL, VENDOR_URL } from "@/lib/app-urls";
import { NAV_LINKS } from "./nav-links";
import { isActivePath } from "./nav-active";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@mongkolka/ui/sheet";


export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-brand-line/60 bg-background/80 px-5 py-3.5 backdrop-blur-md sm:px-12">
      <Link href="/" className="flex items-center gap-2">
        <Heart className="size-5 fill-primary/20 text-primary" />
        <span className="font-display text-2xl leading-none font-medium tracking-tight">Mongkolka</span>
      </Link>

      <nav className="hidden items-center gap-1 md:flex">
        {NAV_LINKS.map((link) => (
          <Button
            key={link.href}
            variant="ghost"
            asChild
            className={isActivePath(pathname, link.href) ? "bg-brand-tint text-primary hover:bg-brand-tint" : undefined}
          >
            <Link href={link.href} aria-current={isActivePath(pathname, link.href) ? "page" : undefined}>
              {link.label}
            </Link>
          </Button>
        ))}
      </nav>

      <div className="hidden items-center gap-2 md:flex">
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
              <Button
                key={link.href}
                variant="ghost"
                className={`justify-start ${isActivePath(pathname, link.href) ? "bg-brand-tint text-primary" : ""}`}
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={link.href} aria-current={isActivePath(pathname, link.href) ? "page" : undefined}>
                  {link.label}
                </Link>
              </Button>
            ))}
            <div className="my-2 border-t" />
            <Button variant="ghost" className="justify-start" asChild>
              <a href={VENDOR_URL}>For vendors</a>
            </Button>
            <Button className="justify-start" asChild>
              <a href={COUPLE_URL}>Start planning</a>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
