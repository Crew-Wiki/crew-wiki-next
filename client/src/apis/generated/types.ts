/**
 * 이 파일은 api-module 제너레이터가 자동 생성한 파일입니다.
 * 직접 수정하지 마세요. `yarn api:generate` 로 다시 생성됩니다.
 */

export type AdminResponse = Record<string, unknown>;

export interface CrewDocumentCreateRequest {
  title: string;
  contents: string;
  writer: string;
  documentBytes: number;
  uuid: string;
}

export interface CrewGraphResponse {
  nodes: GraphNodeResponse[];
  edges: GraphEdgeResponse[];
}

export interface DocumentListResponse {
  id: number;
  title: string;
  contents: string;
  writer: string;
  documentBytes: number;
  generateTime: string;
  uuid: string;
  viewCount: number;
  documentType: 'CREW' | 'ORGANIZATION';
}

export interface DocumentResponse {
  documentId: number;
  documentUUID: string;
  title: string;
  contents: string;
  writer: string;
  generateTime: string;
  viewCount: number;
  latestVersion: number;
  organizationDocumentResponses: OrganizationDocumentResponse[];
}

export interface DocumentSearchResponse {
  title: string;
  uuid: string;
  documentType: 'CREW' | 'ORGANIZATION';
}

export interface DocumentTitleListResponse {
  title: string;
  uuid: string;
  documentType: 'CREW' | 'ORGANIZATION';
  generateTime: string;
}

export interface DocumentUpdateRequest {
  title: string;
  contents: string;
  writer: string;
  documentBytes: number;
  uuid: string;
}

export interface GenerationCrewResponse {
  name: string;
  documentUuid: string;
  field: 'BACKEND' | 'FRONTEND' | 'ANDROID';
}

export interface GraphEdgeResponse {
  sourceDocumentUuid: string;
  targetDocumentUuid: string;
  type: 'REFERENCE' | 'ORGANIZATION_LINK';
}

export interface GraphNodeResponse {
  documentUuid: string;
  title: string;
  type: 'CREW' | 'ORGANIZATION';
}

export interface HistoryDetailResponse {
  logId: number;
  title: string;
  contents: string;
  writer: string;
  generateTime: string;
}

export interface HistoryResponse {
  id: number;
  title: string;
  version: number;
  writer: string;
  documentBytes: number;
  generateTime: string;
}

export interface LinkedCrewDocumentResponse {
  documentUuid: string;
  title: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface OrganizationDocumentAndEventResponse {
  organizationDocumentId: number;
  organizationDocumentUuid: string;
  title: string;
  contents: string;
  writer: string;
  generateTime: string;
  organizationEventResponses: OrganizationEventResponse[];
  linkedCrewDocuments: LinkedCrewDocumentResponse[];
}

export interface OrganizationDocumentCreateRequest {
  title: string;
  contents: string;
  writer: string;
  documentBytes: number;
  crewDocumentUuid: string;
  organizationDocumentUuid: string;
}

export interface OrganizationDocumentLinkRequest {
  crewDocumentUuid: string;
  organizationDocumentUuid: string;
}

export interface OrganizationDocumentResponse {
  organizationDocumentId: number;
  organizationDocumentUuid: string;
  title: string;
  contents: string;
  writer: string;
  generateTime: string;
}

export interface OrganizationDocumentSearchResponse {
  uuid: string;
  title: string;
}

export interface OrganizationDocumentUpdateRequest {
  title: string;
  contents: string;
  writer: string;
  documentBytes: number;
  uuid: string;
}

export interface OrganizationEventCreateRequest {
  title: string;
  contents: string;
  writer: string;
  occurredAt: string;
  organizationDocumentUuid: string;
}

export interface OrganizationEventCreateResponse {
  organizationEventUuid: string;
}

export interface OrganizationEventResponse {
  organizationEventUuid: string;
  title: string;
  contents: string;
  writer: string;
  occurredAt: string;
}

export interface OrganizationEventUpdateRequest {
  title: string;
  contents: string;
  writer: string;
  occurredAt: string;
}

export interface OrganizationEventUpdateResponse {
  organizationEventUuid: string;
  title: string;
  contents: string;
  writer: string;
  occurredAt: string;
}

export interface PagedResponseListDocumentListResponse {
  page: number;
  totalPage: number;
  data: DocumentListResponse[];
}

export interface PagedResponseListHistoryResponse {
  page: number;
  totalPage: number;
  data: HistoryResponse[];
}

export interface PagingRequest {
  pageNumber: number;
  pageSize: number;
  sort: string;
  sortDirection: string;
}

export interface ViewFlushRequest {
  views: Record<string, number>;
}
