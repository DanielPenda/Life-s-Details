import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production builds from overwriting files used by a running dev server.
  distDir: process.env.NODE_ENV === "production" ? ".next-build" : ".next",
  poweredByHeader: false,
};

export default nextConfig;
