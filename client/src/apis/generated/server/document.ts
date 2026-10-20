/**
 * 이 파일은 api-module 제너레이터가 자동 생성한 파일입니다.
 * 직접 수정하지 마세요. `yarn api:generate` 로 다시 생성됩니다.
 */

import {requestDeleteServer, requestGetServer, requestPostServer, requestPutServer} from '@http/server';
import {toQueryParams} from '@http/common';
import {API_BASE_URL, resolveServerOptions} from '@apis/apiConfig';
import type {ServerRequestOptions} from '@apis/apiConfig';
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
        delete: async (options?: ServerRequestOptions): Promise<void> =>
          await requestDeleteServer({
            baseUrl: API_BASE_URL,
            endpoint: `/document/${uuidText}/organization-documents/${organizationDocumentUuidText}`,
            ...resolveServerOptions(
              'DELETE /document/{uuidText}/organization-documents/{organizationDocumentUuidText}',
              {uuidText, organizationDocumentUuidText},
              options,
            ),
          }),
      }),
      {
        /**
         * 특정 문서에 대한 조직 문서 조회 API
         * 특정 문서에 대한 조직 문서들을 조회합니다.
         * `GET /document/{uuidText}/organization-documents`
         */
        get: async (options?: ServerRequestOptions): Promise<OrganizationDocumentSearchResponse[]> =>
          await requestGetServer<OrganizationDocumentSearchResponse[]>({
            baseUrl: API_BASE_URL,
            endpoint: `/document/${uuidText}/organization-documents`,
            ...resolveServerOptions('GET /document/{uuidText}/organization-documents', {uuidText}, options),
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
    get: async (query: PagingRequest, options?: ServerRequestOptions): Promise<PagedResponseListDocumentListResponse> =>
      await requestGetServer<PagedResponseListDocumentListResponse>({
        baseUrl: API_BASE_URL,
        endpoint: `/document`,
        queryParams: toQueryParams(query),
        ...resolveServerOptions('GET /document', {query}, options),
      }),
    /**
     * 위키 글 작성
     * 위키 글을 작성합니다.
     * `POST /document`
     */
    post: async (body: CrewDocumentCreateRequest, options?: ServerRequestOptions): Promise<DocumentResponse> =>
      await requestPostServer<DocumentResponse>({
        baseUrl: API_BASE_URL,
        endpoint: `/document`,
        body,
        ...resolveServerOptions('POST /document', {body}, options),
      }),
    /**
     * 위키 글 수정
     * 위키 글을 수정합니다.
     * `PUT /document`
     */
    put: async (body: DocumentUpdateRequest, options?: ServerRequestOptions): Promise<DocumentResponse> =>
      await requestPutServer<DocumentResponse>({
        baseUrl: API_BASE_URL,
        endpoint: `/document`,
        body,
        ...resolveServerOptions('PUT /document', {body}, options),
      }),
    crews: {
      /**
       * 기수별 크루 목록 조회
       * 기수에 속한 크루의 이름, 문서 UUID, 분야를 조회합니다.
       * `GET /document/crews`
       */
      get: async (query: {generation: string}, options?: ServerRequestOptions): Promise<GenerationCrewResponse[]> =>
        await requestGetServer<GenerationCrewResponse[]>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/crews`,
          queryParams: toQueryParams(query),
          ...resolveServerOptions('GET /document/crews', {query}, options),
        }),
    },
    log: (logId: number) => ({
      /**
       * 로그 상세 조회
       * 로그 ID로 로그 상세 정보를 조회합니다.
       * `GET /document/log/{logId}`
       */
      get: async (options?: ServerRequestOptions): Promise<HistoryDetailResponse> =>
        await requestGetServer<HistoryDetailResponse>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/log/${logId}`,
          ...resolveServerOptions('GET /document/log/{logId}', {logId}, options),
        }),
    }),
    random: {
      /**
       * 랜덤 위키 글 조회
       * 랜덤으로 위키 글을 조회합니다.
       * `GET /document/random`
       */
      get: async (options?: ServerRequestOptions): Promise<DocumentResponse> =>
        await requestGetServer<DocumentResponse>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/random`,
          ...resolveServerOptions('GET /document/random', {}, options),
        }),
    },
    search: {
      /**
       * 키워드로 위키 글 검색
       * 키워드로 위키 글을 검색합니다.
       * `GET /document/search`
       */
      get: async (query: {keyWord: string}, options?: ServerRequestOptions): Promise<DocumentSearchResponse[]> =>
        await requestGetServer<DocumentSearchResponse[]>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/search`,
          queryParams: toQueryParams(query),
          ...resolveServerOptions('GET /document/search', {query}, options),
        }),
    },
    title: (title: string) => ({
      /**
       * 제목으로 위키 글 조회
       * 제목을 통해 위키 글을 조회합니다.
       * `GET /document/title/{title}`
       */
      get: async (options?: ServerRequestOptions): Promise<DocumentResponse> =>
        await requestGetServer<DocumentResponse>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/title/${title}`,
          ...resolveServerOptions('GET /document/title/{title}', {title}, options),
        }),
      uuid: {
        /**
         * 제목으로 UUID 조회
         * 제목을 통해 위키 글의 UUID를 조회합니다.
         * `GET /document/title/{title}/uuid`
         */
        get: async (options?: ServerRequestOptions): Promise<Record<string, unknown>> =>
          await requestGetServer<Record<string, unknown>>({
            baseUrl: API_BASE_URL,
            endpoint: `/document/title/${title}/uuid`,
            ...resolveServerOptions('GET /document/title/{title}/uuid', {title}, options),
          }),
      },
    }),
    titles: {
      /**
       * 위키 글 제목 전체 조회
       * 모든 위키 글의 제목과 UUID를 조회합니다.
       * `GET /document/titles`
       */
      get: async (options?: ServerRequestOptions): Promise<DocumentTitleListResponse[]> =>
        await requestGetServer<DocumentTitleListResponse[]>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/titles`,
          ...resolveServerOptions('GET /document/titles', {}, options),
        }),
    },
    uuid: (uuidText: string) => ({
      /**
       * UUID로 위키 글 조회
       * UUID를 통해 위키 글을 조회합니다.
       * `GET /document/uuid/{uuidText}`
       */
      get: async (options?: ServerRequestOptions): Promise<DocumentResponse> =>
        await requestGetServer<DocumentResponse>({
          baseUrl: API_BASE_URL,
          endpoint: `/document/uuid/${uuidText}`,
          ...resolveServerOptions('GET /document/uuid/{uuidText}', {uuidText}, options),
        }),
      log: {
        /**
         * 문서 로그 목록 조회
         * 문서 UUID로 해당 문서의 로그 목록을 페이지네이션을 통해 조회합니다.
         * `GET /document/uuid/{uuidText}/log`
         */
        get: async (query: PagingRequest, options?: ServerRequestOptions): Promise<PagedResponseListHistoryResponse> =>
          await requestGetServer<PagedResponseListHistoryResponse>({
            baseUrl: API_BASE_URL,
            endpoint: `/document/uuid/${uuidText}/log`,
            queryParams: toQueryParams(query),
            ...resolveServerOptions('GET /document/uuid/{uuidText}/log', {uuidText, query}, options),
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
        post: async (body: ViewFlushRequest, options?: ServerRequestOptions): Promise<string> =>
          await requestPostServer<string>({
            baseUrl: API_BASE_URL,
            endpoint: `/document/views/flush`,
            body,
            ...resolveServerOptions('POST /document/views/flush', {body}, options),
          }),
      },
    },
  },
);
