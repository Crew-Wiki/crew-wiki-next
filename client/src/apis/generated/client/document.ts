/**
 * 이 파일은 api-module 제너레이터가 자동 생성한 파일입니다.
 * 직접 수정하지 마세요. `yarn api:generate` 로 다시 생성됩니다.
 */

'use client';

import {requestDeleteClient, requestGetClient, requestPostClient, requestPutClient} from '@http/client';
import {toQueryParams} from '@http/common';
import {API_BASE_URL} from '@apis/apiConfig';
import type {
  CrewDocumentCreateRequest,
  DocumentResponse,
  DocumentSearchResponse,
  DocumentTitleListResponse,
  DocumentUpdateRequest,
  GenerationCrewResponse,
  HistoryDetailResponse,
  OrganizationDocumentSearchResponse,
  PagedResponseListDocumentListResponse,
  PagedResponseListHistoryResponse,
  PagingRequest,
  ViewFlushRequest,
} from '@apis/generated/types';

export const document = Object.assign(
  (uuidText: string) => ({
    organizationDocuments: Object.assign(
      (organizationDocumentUuidText: string) => ({
        /**
         * 특정 문서에 대한 조직 문서 삭제 API
         * 특정 문서에 대한 조직 문서를 제거합니다.
         * `DELETE /document/{uuidText}/organization-documents/{organizationDocumentUuidText}`
         */
        delete: async (): Promise<void> =>
          await requestDeleteClient({
            baseUrl: API_BASE_URL,
            endpoint: `/document/${uuidText}/organization-documents/${organizationDocumentUuidText}`,
          }),
      }),
      {
        /**
         * 특정 문서에 대한 조직 문서 조회 API
         * 특정 문서에 대한 조직 문서들을 조회합니다.
         * `GET /document/{uuidText}/organization-documents`
         */
        get: async (): Promise<OrganizationDocumentSearchResponse[]> =>
          await requestGetClient<OrganizationDocumentSearchResponse[]>({
            baseUrl: API_BASE_URL,
            endpoint: `/document/${uuidText}/organization-documents`,
          }),
      },
    ),
  }),
  {
    /**
     * 위키 글 전체 조회
     * 페이지네이션을 통해 모든 위키 글을 조회합니다.
     * `GET /document`
     */
    get: async (query: PagingRequest): Promise<PagedResponseListDocumentListResponse> =>
      await requestGetClient<PagedResponseListDocumentListResponse>({
        baseUrl: API_BASE_URL,
        endpoint: `/document`,
        queryParams: toQueryParams(query),
      }),
    /**
     * 위키 글 작성
     * 위키 글을 작성합니다.
     * `POST /document`
     */
    post: async (body: CrewDocumentCreateRequest): Promise<DocumentResponse> =>
      await requestPostClient<DocumentResponse>({
        baseUrl: API_BASE_URL,
        endpoint: `/document`,
        body,
      }),
    /**
     * 위키 글 수정
     * 위키 글을 수정합니다.
     * `PUT /document`
     */
    put: async (body: DocumentUpdateRequest): Promise<DocumentResponse> =>
      await requestPutClient<DocumentResponse>({
        baseUrl: API_BASE_URL,
        endpoint: `/document`,
        body,
      }),
    crews: {
      /**
       * 기수별 크루 목록 조회
       * 기수에 속한 크루의 이름, 문서 UUID, 분야를 조회합니다.
       * `GET /document/crews`
       */
      get: async (query: {generation: string}): Promise<GenerationCrewResponse[]> =>
        await requestGetClient<GenerationCrewResponse[]>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/crews`,
          queryParams: toQueryParams(query),
        }),
    },
    log: (logId: number) => ({
      /**
       * 로그 상세 조회
       * 로그 ID로 로그 상세 정보를 조회합니다.
       * `GET /document/log/{logId}`
       */
      get: async (): Promise<HistoryDetailResponse> =>
        await requestGetClient<HistoryDetailResponse>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/log/${logId}`,
        }),
    }),
    random: {
      /**
       * 랜덤 위키 글 조회
       * 랜덤으로 위키 글을 조회합니다.
       * `GET /document/random`
       */
      get: async (): Promise<DocumentResponse> =>
        await requestGetClient<DocumentResponse>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/random`,
        }),
    },
    search: {
      /**
       * 키워드로 위키 글 검색
       * 키워드로 위키 글을 검색합니다.
       * `GET /document/search`
       */
      get: async (query: {keyWord: string}): Promise<DocumentSearchResponse[]> =>
        await requestGetClient<DocumentSearchResponse[]>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/search`,
          queryParams: toQueryParams(query),
        }),
    },
    title: (title: string) => ({
      /**
       * 제목으로 위키 글 조회
       * 제목을 통해 위키 글을 조회합니다.
       * `GET /document/title/{title}`
       */
      get: async (): Promise<DocumentResponse> =>
        await requestGetClient<DocumentResponse>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/title/${title}`,
        }),
      uuid: {
        /**
         * 제목으로 UUID 조회
         * 제목을 통해 위키 글의 UUID를 조회합니다.
         * `GET /document/title/{title}/uuid`
         */
        get: async (): Promise<Record<string, unknown>> =>
          await requestGetClient<Record<string, unknown>>({
            baseUrl: API_BASE_URL,
            endpoint: `/document/title/${title}/uuid`,
          }),
      },
    }),
    titles: {
      /**
       * 위키 글 제목 전체 조회
       * 모든 위키 글의 제목과 UUID를 조회합니다.
       * `GET /document/titles`
       */
      get: async (): Promise<DocumentTitleListResponse[]> =>
        await requestGetClient<DocumentTitleListResponse[]>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/titles`,
        }),
    },
    uuid: (uuidText: string) => ({
      /**
       * UUID로 위키 글 조회
       * UUID를 통해 위키 글을 조회합니다.
       * `GET /document/uuid/{uuidText}`
       */
      get: async (): Promise<DocumentResponse> =>
        await requestGetClient<DocumentResponse>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/uuid/${uuidText}`,
        }),
      log: {
        /**
         * 문서 로그 목록 조회
         * 문서 UUID로 해당 문서의 로그 목록을 페이지네이션을 통해 조회합니다.
         * `GET /document/uuid/{uuidText}/log`
         */
        get: async (query: PagingRequest): Promise<PagedResponseListHistoryResponse> =>
          await requestGetClient<PagedResponseListHistoryResponse>({
            baseUrl: API_BASE_URL,
            endpoint: `/document/uuid/${uuidText}/log`,
            queryParams: toQueryParams(query),
          }),
      },
    }),
    views: {
      flush: {
        /**
         * 누적 조회수 수신 API
         * 프론트에서 누적된 조회수를 전달받아 DB에 반영합니다.
         * `POST /document/views/flush`
         */
        post: async (body: ViewFlushRequest): Promise<string> =>
          await requestPostClient<string>({
            baseUrl: API_BASE_URL,
            endpoint: `/document/views/flush`,
            body,
          }),
      },
    },
  },
);
