/**
 * Next.js Configuration
 *
 * This file configures the Next.js framework behaviour.
 *
 * images.remotePatterns:
 *   Allows Next.js <Image> components and <img> tags to load images
 *   from the Unsplash domain. Without this, Next.js would block
 *   external images for security reasons. Our bean images are all
 *   hosted on images.unsplash.com.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
