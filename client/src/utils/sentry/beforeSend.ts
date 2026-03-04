import type {ErrorEvent, EventHint} from '@sentry/nextjs';
import {classifyError} from './classifyError';
import {ERROR_LEVEL} from '@constants/sentry';

export const beforeSend = (event: ErrorEvent, hint: EventHint): ErrorEvent | null => {
  const {level, category} = classifyError(event, hint);

  if (level === ERROR_LEVEL.LOW) {
    return null;
  }

  event.tags = {
    ...event.tags,
    'error.level': level,
    'error.category': category,
  };

  event.level = level === ERROR_LEVEL.HIGH ? 'error' : 'warning';

  return event;
};
