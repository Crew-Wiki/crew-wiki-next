import type {ErrorEvent, EventHint} from '@sentry/nextjs';
import type {ErrorClassification} from '@type/Sentry.type';
import {
  ERROR_CATEGORY,
  BROWSER_EXTENSION_PATTERNS,
  NETWORK_ERROR_PATTERNS,
  CORE_FEATURE_FAILURE_PATTERNS,
  AUTH_ENDPOINT_PATTERNS,
  ERROR_LEVEL,
} from '@constants/sentry';
import {VALIDATION_ERROR_PATTERNS} from '@constants/validation';
import {HttpError} from './httpError';

const getErrorMessage = (event: ErrorEvent, hint: EventHint): string => {
  const original = hint.originalException;
  if (original instanceof Error) return original.message;
  if (typeof original === 'string') return original;

  const exceptionValue = event.exception?.values?.[0]?.value;
  if (exceptionValue) return exceptionValue;

  if (event.message) return event.message;

  return '';
};

const getStackTrace = (event: ErrorEvent, hint: EventHint): string => {
  const original = hint.originalException;
  if (original instanceof Error && original.stack) return original.stack;

  const frames = event.exception?.values?.[0]?.stacktrace?.frames;
  if (frames) {
    return frames.map(f => f.filename || '').join('\n');
  }

  return '';
};

const getStatusCode = (hint: EventHint): number | null => {
  const original = hint.originalException;
  if (original instanceof HttpError) return original.statusCode;
  return null;
};

const isBrowserExtensionError = (event: ErrorEvent, hint: EventHint): boolean => {
  const stack = getStackTrace(event, hint);
  return BROWSER_EXTENSION_PATTERNS.some(pattern => stack.includes(pattern));
};

const isNetworkError = (message: string): boolean => {
  return NETWORK_ERROR_PATTERNS.some(pattern => message.toLowerCase().includes(pattern.toLowerCase()));
};

const isValidationError = (message: string): boolean => {
  return Object.values(VALIDATION_ERROR_PATTERNS).some(pattern => message.includes(pattern));
};

const isAuthRelated = (hint: EventHint): boolean => {
  const original = hint.originalException;
  if (original instanceof HttpError) {
    return AUTH_ENDPOINT_PATTERNS.some(pattern => original.endpoint.includes(pattern));
  }
  return false;
};

const isCoreFeatureFailure = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return CORE_FEATURE_FAILURE_PATTERNS.some(pattern => lowerMessage.includes(pattern.toLowerCase()));
};

export const classifyError = (event: ErrorEvent, hint: EventHint): ErrorClassification => {
  const message = getErrorMessage(event, hint);
  const statusCode = getStatusCode(hint);

  // === Error Level Low: Sentry로 에러를 보내지 않습니다 ===

  if (isBrowserExtensionError(event, hint)) {
    return {level: ERROR_LEVEL.LOW, category: ERROR_CATEGORY.NETWORK};
  }

  if (isNetworkError(message)) {
    return {level: ERROR_LEVEL.LOW, category: ERROR_CATEGORY.NETWORK};
  }

  if (isValidationError(message)) {
    return {level: ERROR_LEVEL.LOW, category: ERROR_CATEGORY.VALIDATION};
  }

  if (statusCode === 404) {
    return {level: ERROR_LEVEL.LOW, category: ERROR_CATEGORY.API};
  }

  // === Error Level Medium:
  // 주 1회 요약하여 알림을 보내고, 1시간 내 10회 이상 발생 시 Sentry에서 High로 상향됩니다 ===

  if (statusCode === 400) {
    return {level: ERROR_LEVEL.MEDIUM, category: ERROR_CATEGORY.API};
  }

  if (statusCode === 403) {
    return {level: ERROR_LEVEL.MEDIUM, category: ERROR_CATEGORY.AUTH};
  }

  if (statusCode === 429) {
    return {level: ERROR_LEVEL.MEDIUM, category: ERROR_CATEGORY.API};
  }

  // === Error Level High: 즉시 알림을 보냅니다 ===

  if (isAuthRelated(hint)) {
    return {level: ERROR_LEVEL.HIGH, category: ERROR_CATEGORY.AUTH};
  }

  if (statusCode !== null && statusCode >= 500) {
    return {level: ERROR_LEVEL.HIGH, category: ERROR_CATEGORY.API};
  }

  if (statusCode !== null && isCoreFeatureFailure(message)) {
    return {level: ERROR_LEVEL.HIGH, category: ERROR_CATEGORY.API};
  }

  const lowerMessage = message.toLowerCase();
  if (
    lowerMessage.includes('timeout') ||
    lowerMessage.includes('out of memory') ||
    lowerMessage.includes('maximum call stack')
  ) {
    return {level: ERROR_LEVEL.HIGH, category: ERROR_CATEGORY.UNKNOWN};
  }

  // 분류되지 않은 HTTP 4xx
  if (statusCode !== null && statusCode >= 400 && statusCode < 500) {
    return {level: ERROR_LEVEL.MEDIUM, category: ERROR_CATEGORY.API};
  }

  return {level: ERROR_LEVEL.HIGH, category: ERROR_CATEGORY.UNKNOWN};
};
