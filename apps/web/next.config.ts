import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@expense-tracker/db"],
};

export default config;
