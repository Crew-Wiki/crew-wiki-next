export interface OrganizationEvent {
  id: number;
  uuid: string;
  title: string;
  contents: string;
  writer: string;
  occurredAt: string;
  organizationDocumentId: number;
  imageUrl?: string;
}

export interface EventFormData {
  title: string;
  contents: string;
  writer: string;
  occurredAt: string;
  organizationDocumentUuid: string;
}

// 조직 이벤트 생성 응답 타입
export interface OrganizationEventCreateResponse {
  organizationEventUuid: string;
}

// 조직 이벤트 수정 요청 타입
export interface OrganizationEventUpdateRequest {
  title: string;
  contents: string;
  writer: string;
  occurredAt: string;
}
