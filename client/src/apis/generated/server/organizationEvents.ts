/**
 * 이 파일은 api-module 제너레이터가 자동 생성한 파일입니다.
 * 직접 수정하지 마세요. `yarn api:generate` 로 다시 생성됩니다.
 */

import {requestDeleteServer, requestPostServer, requestPutServer} from '@http/server';
import {API_BASE_URL, resolveServerOptions} from '@apis/apiConfig';
import type {ServerRequestOptions} from '@apis/apiConfig';
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
    delete: async (options?: ServerRequestOptions): Promise<void> =>
      await requestDeleteServer({
        baseUrl: API_BASE_URL,
        endpoint: `/organization-events/${organizationEventUuid}`,
        ...resolveServerOptions(
          'DELETE /organization-events/{organizationEventUuid}',
          {organizationEventUuid},
          options,
        ),
      }),
    /**
     * 조직 이벤트 수정
     * 조직 이벤트를 수정합니다.
     * `PUT /organization-events/{organizationEventUuid}`
     */
    put: async (
      body: OrganizationEventUpdateRequest,
      options?: ServerRequestOptions,
    ): Promise<OrganizationEventUpdateResponse> =>
      await requestPutServer<OrganizationEventUpdateResponse>({
        baseUrl: API_BASE_URL,
        endpoint: `/organization-events/${organizationEventUuid}`,
        body,
        ...resolveServerOptions(
          'PUT /organization-events/{organizationEventUuid}',
          {organizationEventUuid, body},
          options,
        ),
      }),
  }),
  {
    /**
     * 조직 이벤트 생성
     * 조직 이벤트를 생성합니다.
     * `POST /organization-events`
     */
    post: async (
      body: OrganizationEventCreateRequest,
      options?: ServerRequestOptions,
    ): Promise<OrganizationEventCreateResponse> =>
      await requestPostServer<OrganizationEventCreateResponse>({
        baseUrl: API_BASE_URL,
        endpoint: `/organization-events`,
        body,
        ...resolveServerOptions('POST /organization-events', {body}, options),
      }),
  },
);
