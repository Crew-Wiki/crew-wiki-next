/**
 * 이 파일은 api-module 제너레이터가 자동 생성한 파일입니다.
 * 직접 수정하지 마세요. `yarn api:generate` 로 다시 생성됩니다.
 */

'use client';

import {requestGetClient, requestPostClient, requestPutClient} from '@http/client';
import {API_BASE_URL} from '@apis/apiConfig';
import type {
  OrganizationDocumentAndEventResponse,
  OrganizationDocumentCreateRequest,
  OrganizationDocumentLinkRequest,
  OrganizationDocumentResponse,
  OrganizationDocumentUpdateRequest,
} from '@apis/generated/types';

export const organization = {
  /**
   * 조직 위키 글 생성 및 연결
   * 조직 위키 글을 생성하며 크루 문서와 연결합니다.
   * `POST /organization`
   */
  post: async (body: OrganizationDocumentCreateRequest): Promise<OrganizationDocumentResponse> =>
    await requestPostClient<OrganizationDocumentResponse>({
      baseUrl: API_BASE_URL,
      endpoint: `/organization`,
      body,
    }),
  /**
   * 조직 위키 글 수정
   * 조직 위키 글을 수정합니다.
   * `PUT /organization`
   */
  put: async (body: OrganizationDocumentUpdateRequest): Promise<OrganizationDocumentResponse> =>
    await requestPutClient<OrganizationDocumentResponse>({
      baseUrl: API_BASE_URL,
      endpoint: `/organization`,
      body,
    }),
  link: {
    /**
     * 기존 조직 문서를 크루 문서에 연결
     * 이미 존재하는 조직 문서를 크루 문서와 연결합니다.
     * `POST /organization/link`
     */
    post: async (body: OrganizationDocumentLinkRequest): Promise<OrganizationDocumentResponse> =>
      await requestPostClient<OrganizationDocumentResponse>({
        baseUrl: API_BASE_URL,
        endpoint: `/organization/link`,
        body,
      }),
  },
  uuid: (uuidText: string) => ({
    /**
     * UUID로 조직 문서 및 이벤트 조회
     * UUID를 통해 조직 문서 및 이벤트를 조회합니다.
     * `GET /organization/uuid/{uuidText}`
     */
    get: async (): Promise<OrganizationDocumentAndEventResponse> =>
      await requestGetClient<OrganizationDocumentAndEventResponse>({
        baseUrl: API_BASE_URL,
        endpoint: `/organization/uuid/${uuidText}`,
      }),
  }),
};
