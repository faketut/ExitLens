import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output bundles a minimal Node.js server into .next/standalone
  // Required for container-based deployment (CloudBase 云托管, Docker, etc.)
  output: "standalone",
};

export default nextConfig;
