/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deploys to cPanel/Apache as plain files — no Node server at runtime.
  output: 'export',

  // The Image Optimization API needs a server, which the export doesn't have.
  // Assets are pre-sized by scripts/build-sequence.mjs instead.
  images: { unoptimized: true },

  // Apache serves directories, not extensionless paths: this makes /careers/
  // resolve to careers/index.html rather than 404.
  trailingSlash: true,

  // Empty for the real site, which sits at the domain root. The GitHub Pages
  // preview is served from /ZealousSolutions/ and sets this at build time.
  // Keep this reading the env var: hard-coding '' breaks the Pages preview
  // (every script and stylesheet 404s) while changing nothing locally.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
};

export default nextConfig;
