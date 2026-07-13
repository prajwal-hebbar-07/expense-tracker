import type { NextConfig } from "next";

const config: NextConfig = {
  // CI and local verification can use a separate output directory without
  // overwriting the assets of a running development server.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  reactStrictMode: true,
  transpilePackages: ["@expense-tracker/db"],
  serverExternalPackages: ["better-sqlite3"],
  webpack: (webpackConfig, { isServer }) => {
    if (isServer) {
      // better-sqlite3 is a native module; it must be required at runtime,
      // never bundled (its "bindings" loader breaks inside webpack output).
      webpackConfig.externals.push({ "better-sqlite3": "commonjs better-sqlite3" });
    }
    return webpackConfig;
  },
};

export default config;
