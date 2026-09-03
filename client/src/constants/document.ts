import type {DocumentListResponse} from '@apis/generated/types';

export const DOCUMENT_TYPE = {
  Crew: 'CREW',
  Organization: 'ORGANIZATION',
} as const;

/** 백엔드 응답의 documentType 필드에서 파생한다 */
export type DocumentType = DocumentListResponse['documentType'];
