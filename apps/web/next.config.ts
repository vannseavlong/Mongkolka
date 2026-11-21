import type { NextConfig } from "next";

// Static export so the app can be served from Firebase Hosting (free Spark plan), same as admin
// and couple. Everything live (couple sites, marketplace, templates) is client-rendered against
// the API; dynamic routes are built once with the placeholder "_" and Firebase rewrites real URLs
// to them (see firebase.json).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["@mongkolka/ui", "@mongkolka/templates"],
};

export default nextConfig;
