import type {NextConfig} from 'next';
import URLS from '@/constants/urls';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: '/',
      destination: `${URLS.WIKI}/${URLS.DAEMOON}`,
      permanent: false,
    },
  ],
};

export default nextConfig;
