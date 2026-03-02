export const ERROR_LEVEL = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const ERROR_CATEGORY = {
  API: 'api',
  AUTH: 'auth',
  NETWORK: 'network',
  VALIDATION: 'validation',
  UNKNOWN: 'unknown',
} as const;

export const BROWSER_EXTENSION_PATTERNS = [
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
  'ms-browser-extension://',
] as const;

export const NETWORK_ERROR_PATTERNS = [
  'Failed to fetch',
  'NetworkError',
  'Network request failed',
  'net::ERR_',
  'AbortError',
  'The operation was aborted',
  'Load failed',
  'The Internet connection appears to be offline',
] as const;

export const CORE_FEATURE_FAILURE_PATTERNS = [
  'upload',
  'download',
  'sync',
  'presigned',
  '이미지 업로드',
  'search',
  'document',
] as const;

export const AUTH_ENDPOINT_PATTERNS = ['/auth/', '/admin/'] as const;
