import {withSentryConfig} from '@sentry/nextjs';
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
    {
      source: `${URLS.wiki}/%EB%8C%80%EB%AC%B8`,
      destination: `${URLS.wiki}/${URLS.daemoon}`,
      permanent: true,
    },
  ],
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'crew-wiki',

  project: 'crew-wiki',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
  sourcemaps: {deleteSourcemapsAfterUpload: true},
});
