/** @type {import('next').NextConfig} */

// Static export for GitHub Pages. When building in the Pages workflow we
// serve from a project subpath (https://<owner>.github.io/<repo>/), so the
// base path is applied there via NEXT_PUBLIC_BASE_PATH. A local dev or build
// with the variable unset stays at the root.
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
