declare namespace NodeJS {
  interface ProcessEnv {
    API_BASE_URL: string;
    BUCKET_NAME: string;
    BUCKET_REGION: string;
    ACCESS_KEY: string;
    SECRET_KEY: string;
    GOOGLE_ANALYTICS_TRACKING_ID: string;
  }
}
