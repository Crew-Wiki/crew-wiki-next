declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE_URL: string;
    NEXT_PUBLIC_BASE_URL: string;
    NEXT_PUBLIC_BUCKET_NAME: string;
    NEXT_PUBLIC_BUCKET_REGION: string;
    NEXT_PUBLIC_ACCESS_KEY: string;
    NEXT_PUBLIC_SECRET_KEY: string;
    NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID: string;
  }
}
