// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import {classifyError} from '@utils/sentry/classifyError';
import {ERROR_LEVEL} from '@constants/sentry';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  beforeSend(event, hint) {
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
  },
});
