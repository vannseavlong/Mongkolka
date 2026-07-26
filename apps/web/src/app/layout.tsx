import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mongkolka",
  description: "Plan your wedding and share a beautiful website with your guests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
