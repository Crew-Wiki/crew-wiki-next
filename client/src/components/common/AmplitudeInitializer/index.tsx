'use client';

import {useEffect} from 'react';
import {init} from '@amplitude/analytics-browser';

export const AmplitudeInitializer = () => {
  useEffect(() => {
    init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, {
      autocapture: {
        elementInteractions: false,
        fileDownloads: false,
        sessions: false,
        formInteractions: false,
      },
    });
  }, []);

  return null;
};
