import type { Metadata } from "next";
import { Toaster } from "@mongkolka/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mongkolka Admin",
  description: "Mongkolka admin portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
