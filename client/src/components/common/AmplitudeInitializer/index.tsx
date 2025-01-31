'use client';

import {useEffect} from 'react';
import {init} from '@amplitude/analytics-browser';

export const AmplitudeInitializer = () => {
  useEffect(() => {
    init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);
  }, []);

  return null;
};
