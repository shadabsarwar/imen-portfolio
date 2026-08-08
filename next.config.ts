import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to THIS project so Turbopack doesn't wrongly infer
  // the home-folder lockfile (C:\Users\user\package-lock.json) as the root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
