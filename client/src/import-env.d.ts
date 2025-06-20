declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE_URL: string;
    NEXT_PUBLIC_BASE_URL: string;
    NEXT_PUBLIC_AMPLITUDE_API_KEY: string;
    NEXT_PUBLIC_IMAGE_S3_DOMAIN: string;
    NEXT_PUBLIC_IMAGE_CLOUDFRONT_DOMAIN: string;
    NEXT_PUBLIC_CDN_DOMAIN: string;
  }
}
