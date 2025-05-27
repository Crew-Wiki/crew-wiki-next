import type {NextConfig} from 'next';
import {URLS} from '@constants/urls';

const DOMAIN_HOSTNAME = process.env.NEXT_PUBLIC_CDN_DOMAIN.replace('https://', '');

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
        hostname: DOMAIN_HOSTNAME,
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
