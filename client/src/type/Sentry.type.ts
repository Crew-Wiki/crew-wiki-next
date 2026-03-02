export type ErrorLevel = 'high' | 'medium' | 'low';

export type ErrorCategory = 'api' | 'auth' | 'network' | 'validation' | 'unknown';

export type ErrorClassification = {
  level: ErrorLevel;
  category: ErrorCategory;
};
