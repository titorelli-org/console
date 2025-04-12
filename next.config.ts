import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    SITE_ORIGIN: process.env.SITE_ORIGIN,
  },
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
