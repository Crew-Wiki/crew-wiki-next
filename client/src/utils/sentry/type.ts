import {ERROR_LEVEL, ERROR_CATEGORY} from '@constants/sentry';

export type ErrorLevel = (typeof ERROR_LEVEL)[keyof typeof ERROR_LEVEL];
export type ErrorCategory = (typeof ERROR_CATEGORY)[keyof typeof ERROR_CATEGORY];

export type ErrorClassification = {
  level: ErrorLevel;
  category: ErrorCategory;
};
