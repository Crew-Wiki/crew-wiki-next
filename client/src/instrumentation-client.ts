// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import {classifyError} from '@utils/sentry/classifyError';
import {ERROR_LEVEL} from '@constants/sentry';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

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

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
