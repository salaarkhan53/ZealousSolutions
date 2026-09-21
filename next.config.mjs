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
};

export default nextConfig;
