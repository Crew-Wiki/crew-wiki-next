'use client';

import {track} from '@amplitude/analytics-browser';
import {useCallback} from 'react';

const useAmplitude = () => {
  const trackEvent = useCallback((eventName: string, eventProps: Record<string, unknown> = {}) => {
    const domainEnv = process.env.NODE_ENV;

    track({
      event_type: eventName,
      event_properties: {domain: domainEnv, ...eventProps},
    });
  }, []);

  const trackDocumentCreate = useCallback(
    (title: string) => {
      trackEvent('문서 작성', {
        title,
      });
    },
    [trackEvent],
  );

  const trackDocumentUpdate = useCallback(
    (title: string) => {
      trackEvent('문서 수정', {
        title,
      });
    },
    [trackEvent],
  );

  return {
    trackDocumentCreate,
    trackDocumentUpdate,
  };
};

export default useAmplitude;
