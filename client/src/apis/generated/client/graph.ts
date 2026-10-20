/**
 * 이 파일은 api-module 제너레이터가 자동 생성한 파일입니다.
 * 직접 수정하지 마세요. `yarn api:generate` 로 다시 생성됩니다.
 */

'use client';

import {requestGetClient} from '@http/client';
import {toQueryParams} from '@http/common';
import {API_BASE_URL} from '@apis/apiConfig';
import type {CrewGraphResponse} from '@apis/generated/types';

export const graph = {
  /**
   * 크루 관계 그래프 조회
   * 기수에 속한 크루 문서 관계를 조회하고, 조직 선택 시 조직 노드와 연결 간선을 추가합니다.
   * `GET /graph`
   */
  get: async (query: {generation: string; organizationDocumentUuid?: string}): Promise<CrewGraphResponse> =>
    await requestGetClient<CrewGraphResponse>({
      baseUrl: API_BASE_URL,
      endpoint: `/graph`,
      queryParams: toQueryParams(query),
    }),
};
