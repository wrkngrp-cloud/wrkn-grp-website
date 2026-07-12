/** @type {import('next').NextConfig} */

// Static export. When served from a project subpath (GitHub Pages style,
// https://<owner>.github.io/<repo>/) the base path comes in via
// NEXT_PUBLIC_BASE_PATH. Local dev/builds with it unset stay at the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
