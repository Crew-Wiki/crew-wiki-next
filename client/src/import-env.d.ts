declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE_URL: string;
    NEXT_PUBLIC_BASE_URL: string;
    NEXT_PUBLIC_BUCKET_NAME: string;
    NEXT_PUBLIC_BUCKET_REGION: string;
    NEXT_PUBLIC_ACCESS_KEY: string;
    NEXT_PUBLIC_SECRET_KEY: string;
    NEXT_PUBLIC_AMPLITUDE_API_KEY: string;
    NEXT_PUBLIC_IMAGE_S3_DOMAIN: string;
    NEXT_PUBLIC_IMAGE_CLOUDFRONT_DOMAIN: string;
  }
}
