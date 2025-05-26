import type {NextConfig} from 'next';
import {URLS} from '@constants/urls';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_CDN_DOMAIN.slice(8),
        pathname: '/images/**',
      },
    ],
  },
  redirects: async () => [
    {
      source: '/',
      destination: `${URLS.wiki}/${URLS.daemoon}`,
      permanent: false,
    },
  ],
};

export default nextConfig;
