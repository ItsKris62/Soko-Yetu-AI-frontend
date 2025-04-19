import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { appDir: true } as any,
  i18n: {
    locales: ['en', 'sw'],
    defaultLocale: 'en',
  },

  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
