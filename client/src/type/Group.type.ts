export interface GroupDocument {
  id: string;
  title: string;
  contents: string;
  writer: string;
  uuid: string;
  documentUUID: string;
  documentBytes: number;
}

export interface GroupDocumentResponse {
  organizationDocumentId: number;
  organizationDocumentUuid: string;
  title: string;
  contents: string;
  writer: string;
  generateTime: string;
}

// 조직 이벤트 응답 타입 (조직 문서 조회 시 포함)
export interface OrganizationEventResponse {
  organizationEventUuid: string;
  title: string;
  contents: string;
  writer: string;
  occurredAt: string;
}

// 조직 문서 및 이벤트 조회 응답 타입
export interface OrganizationDocumentWithEventsResponse {
  organizationDocumentId: number;
  organizationDocumentUuid: string;
  title: string;
  contents: string;
  writer: string;
  generateTime: string;
  organizationEventResponses: OrganizationEventResponse[];
}

// 조직 문서 생성 요청 타입
export interface OrganizationDocumentCreateRequest {
  title: string;
  contents: string;
  writer: string;
  documentBytes: number;
  crewDocumentUuid: string;
  organizationDocumentUuid: string;
}

// 조직 문서 수정 요청 타입
export interface OrganizationDocumentUpdateRequest {
  title: string;
  contents: string;
  writer: string;
  documentBytes: number;
  uuid: string;
}

// 문서-그룹문서 연결 관계 타입
export interface DocumentGroupDocumentLink {
  id: number;
  documentId: number;
  organizationDocumentId: number;
}

export interface GroupEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  imageUrl?: string;
  occurredAt: string;
}
