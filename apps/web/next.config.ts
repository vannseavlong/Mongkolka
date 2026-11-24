import type { NextConfig } from "next";

// Static export so the app can be served from Firebase Hosting (free Spark plan), same as admin
// and couple. Everything live (couple sites, marketplace, templates) is client-rendered against
// the API; dynamic routes are built once with the placeholder "_" and Firebase rewrites real URLs
// to them (see firebase.json).
// `next dev` has no Firebase, so real URLs (/templates/preview/<slug>, /<slug>, /<slug>/wishes ...) would fail with
// "missing param in generateStaticParams". In development only, rewrite them to the "_" shell like firebase.json does.
// Production is untouched: the export build never calls rewrites().
const RESERVED = "_|_next|marketplace|templates|about|contact|dev-.*";
// Single path segments only ([^/]+): rewrites chain, and "_" is excluded so a rewritten URL is never rewritten again.
const devRewrites = async () => ({
  beforeFiles: [
    { source: "/marketplace/:id((?!_$)[^/]+)", destination: "/marketplace/_" },
    { source: "/templates/preview/:slug((?!_$)[^/]+)", destination: "/templates/preview/_" },
    { source: "/templates/:id((?!(?:_|preview)$)[^/]+)", destination: "/templates/_" },
    { source: `/:slug((?!(?:${RESERVED})$)[^/]+)/wishes`, destination: "/_/wishes" },
    { source: `/:slug((?!(?:${RESERVED})$)[^/]+)/photos`, destination: "/_/photos" },
    { source: `/:slug((?!(?:${RESERVED})$)[^/]+)`, destination: "/_" },
  ],
  afterFiles: [],
  fallback: [],
});

const nextConfig: NextConfig = {
  output: "export",
  ...(process.env.NODE_ENV === "development" ? { rewrites: devRewrites } : {}),
  images: { unoptimized: true },
  transpilePackages: ["@mongkolka/ui", "@mongkolka/templates"],
};

export default nextConfig;
