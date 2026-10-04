'use client';

import {track} from '@amplitude/analytics-browser';
import {useCallback} from 'react';
import {FieldId, Generation} from '@type/Graph.type';

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

  // 관계 그래프 이벤트 2개. 이벤트가 이 파일 하나에 모여 있어 각자 추가하면 충돌하므로 한 번에 넣는다.
  // 배선은 각자의 다음 PR 에서 한다 — 화면 진입은 그래프 페이지, 크루 클릭은 그래프 컴포넌트.
  const trackGraphView = useCallback(
    (generations: Generation[]) => {
      trackEvent('관계 그래프 조회', {
        generations,
      });
    },
    [trackEvent],
  );

  const trackGraphCrewClick = useCallback(
    (title: string, documentUUID: string, field: FieldId) => {
      trackEvent('관계 그래프 크루 클릭', {
        title,
        documentUUID,
        field,
      });
    },
    [trackEvent],
  );

  return {
    trackDocumentCreate,
    trackDocumentUpdate,
    trackDocumentSearch,
    trackGraphView,
    trackGraphCrewClick,
  };
};

export default useAmplitude;
