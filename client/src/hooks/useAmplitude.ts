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
    (title: string, documentUUID: string) => {
      trackEvent('문서 작성', {
        title,
        documentUUID,
      });
    },
    [trackEvent],
  );

  const trackDocumentUpdate = useCallback(
    (title: string, documentUUID: string) => {
      trackEvent('문서 수정', {
        title,
        documentUUID,
      });
    },
    [trackEvent],
  );

  const trackDocumentSearch = useCallback(
    (title: string, documentUUID: string) => {
      trackEvent('문서 검색', {
        title,
        documentUUID,
      });
    },
    [trackEvent],
  );

  return {
    trackDocumentCreate,
    trackDocumentUpdate,
    trackDocumentSearch,
  };
};

export default useAmplitude;
