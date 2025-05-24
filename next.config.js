// next.config.js

/**
 * @type {import('next').NextConfig}
 * This JSDoc comment provides type checking and autocompletion in your editor.
 */
const nextConfig = {
  reactStrictMode: false, // Temporarily disabled to prevent double mounting during development
  // === Add any other Next.js specific configurations below this line ===
  // Example: images: { domains: ['example.com'] },
  // Example: experimental: { serverActions: true }, // If using Server Actions
  // === End of custom configurations ===
  images: {
    domains: ["img.youtube.com", "i.ytimg.com"],
    unoptimized: false,
  },
};

// Export the configuration object using CommonJS syntax
module.exports = nextConfig;
