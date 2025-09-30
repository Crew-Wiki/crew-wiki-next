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

