import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable experimental feature for using cache
    useCache: true,
  },
};

export default nextConfig;
