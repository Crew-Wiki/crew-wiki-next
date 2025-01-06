import type {NextConfig} from 'next';
import {URLS} from '@constants/urls';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
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
