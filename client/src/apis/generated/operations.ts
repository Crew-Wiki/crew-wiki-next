/**
 * 이 파일은 api-module 제너레이터가 자동 생성한 파일입니다.
 * 직접 수정하지 마세요. `yarn api:generate` 로 다시 생성됩니다.
 */

import type {
  CrewDocumentCreateRequest,
  DocumentUpdateRequest,
  LoginRequest,
  OrganizationDocumentCreateRequest,
  OrganizationDocumentLinkRequest,
  OrganizationDocumentUpdateRequest,
  OrganizationEventCreateRequest,
  OrganizationEventUpdateRequest,
  PagingRequest,
  ViewFlushRequest,
} from './types';

/** 오퍼레이션 키 -> 호출 인자. 키는 OpenAPI 문서의 `METHOD /path` 표기 그대로다 */
export interface OperationArgsMap {
  'DELETE /admin/documents/{documentUuid}': {documentUuid: string};
  'POST /auth/login': {body: LoginRequest};
  'GET /auth/login/check': Record<string, never>;
  'POST /auth/logout': Record<string, never>;
  'GET /document': {query: PagingRequest};
  'POST /document': {body: CrewDocumentCreateRequest};
  'PUT /document': {body: DocumentUpdateRequest};
  'GET /document/{uuidText}/organization-documents': {uuidText: string};
  'DELETE /document/{uuidText}/organization-documents/{organizationDocumentUuidText}': {
    uuidText: string;
    organizationDocumentUuidText: string;
  };
  'GET /document/crews': {query: {generation: string}};
  'GET /document/log/{logId}': {logId: number};
  'GET /document/random': Record<string, never>;
  'GET /document/search': {query: {keyWord: string}};
  'GET /document/title/{title}': {title: string};
  'GET /document/title/{title}/uuid': {title: string};
  'GET /document/titles': Record<string, never>;
  'GET /document/uuid/{uuidText}': {uuidText: string};
  'GET /document/uuid/{uuidText}/log': {uuidText: string; query: PagingRequest};
  'POST /document/views/flush': {body: ViewFlushRequest};
  'GET /graph': {query: {generation: string; organizationDocumentUuid?: string}};
  'POST /organization': {body: OrganizationDocumentCreateRequest};
  'PUT /organization': {body: OrganizationDocumentUpdateRequest};
  'POST /organization-events': {body: OrganizationEventCreateRequest};
  'DELETE /organization-events/{organizationEventUuid}': {organizationEventUuid: string};
  'PUT /organization-events/{organizationEventUuid}': {
    organizationEventUuid: string;
    body: OrganizationEventUpdateRequest;
  };
  'POST /organization/link': {body: OrganizationDocumentLinkRequest};
  'GET /organization/uuid/{uuidText}': {uuidText: string};
}

export type OperationKey = keyof OperationArgsMap;
