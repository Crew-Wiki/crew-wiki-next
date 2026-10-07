/**
 * 이 파일은 api-module 제너레이터가 자동 생성한 파일입니다.
 * 직접 수정하지 마세요. `yarn api:generate` 로 다시 생성됩니다.
 */

'use client';

import {requestDeleteClient, requestPostClient, requestPutClient} from '@http/client';
import {API_BASE_URL} from '@apis/apiConfig';
import type {
  OrganizationEventCreateRequest,
  OrganizationEventCreateResponse,
  OrganizationEventUpdateRequest,
  OrganizationEventUpdateResponse,
} from '@apis/generated/types';

export const organizationEvents = Object.assign(
  (organizationEventUuid: string) => ({
    /**
     * 조직 이벤트 삭제
     * 조직 이벤트를 삭제합니다.
     * `DELETE /organization-events/{organizationEventUuid}`
     */
    delete: async (): Promise<void> =>
      await requestDeleteClient({
        baseUrl: API_BASE_URL,
        endpoint: `/organization-events/${organizationEventUuid}`,
      }),
    /**
     * 조직 이벤트 수정
     * 조직 이벤트를 수정합니다.
     * `PUT /organization-events/{organizationEventUuid}`
     */
    put: async (body: OrganizationEventUpdateRequest): Promise<OrganizationEventUpdateResponse> =>
      await requestPutClient<OrganizationEventUpdateResponse>({
        baseUrl: API_BASE_URL,
        endpoint: `/organization-events/${organizationEventUuid}`,
        body,
      }),
  }),
  {
    /**
     * 조직 이벤트 생성
     * 조직 이벤트를 생성합니다.
     * `POST /organization-events`
     */
    post: async (body: OrganizationEventCreateRequest): Promise<OrganizationEventCreateResponse> =>
      await requestPostClient<OrganizationEventCreateResponse>({
        baseUrl: API_BASE_URL,
        endpoint: `/organization-events`,
        body,
      }),
  },
);
