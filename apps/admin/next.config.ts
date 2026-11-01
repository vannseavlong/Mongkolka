import type { NextConfig } from "next";

// Static export so the app can be served from Firebase Hosting (free Spark plan).
// Everything is client-rendered against the API; there is no server runtime.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["@mongkolka/ui"],
};

export default nextConfig;
