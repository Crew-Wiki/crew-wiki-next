import {SORT_OPTIONS} from '@constants/popular';
import {Organization} from './Group.type';

export const DOCUMENT_TYPE = {
  Crew: 'CREW',
  Organization: 'ORGANIZATION',
} as const;

export type DocumentType = (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE];

export interface WikiDocument {
  documentId: number;
  documentUUID: string;
  title: string;
  contents: string;
  writer: string;
  generateTime: string;
  organizations: Organization[];
}

export interface LatestWikiDocument extends WikiDocument {
  latestVersion: number;
}

export interface WriteDocumentContent {
  title: string;
  contents: string;
  writer: string;
  documentBytes: number;
}

export interface WikiDocumentLogSummary {
  id: number;
  title: string;
  version: number;
  writer: string;
  documentBytes: number;
  generateTime: string;
}

export interface WikiDocumentLogDetail {
  contents: string;
  generateTime: string;
  logId: number;
  title: string;
  writer: string;
}

export interface PopularDocument {
  id: number;
  title: string;
  viewCount: number;
  editCount: number;
}

export type ErrorMessage = string | null;

export type ErrorInfo = {
  errorMessage: ErrorMessage;
  reset: ((value: string) => string) | null;
};

export const SortOptions = {
  views: {
    label: SORT_OPTIONS.views.label,
  },
  edits: {
    label: SORT_OPTIONS.edits.label,
  },
};

export type SortType = keyof typeof SortOptions;

export type WikiDocumentExpand = Omit<WikiDocument, 'documentUUID' | 'documentId'> & {
  uuid: string;
  id: number;
  documentBytes: number;
  viewCount: number;
  documentType: DocumentType;
};

export interface PostDocumentBody {
  title: string;
  contents: string;
  writer: string;
  documentBytes: number;
  uuid: string;
}

export interface PostDocumentContent extends PostDocumentBody {
  newOrganizations: Organization[];
  existingOrganizations: Organization[];
}
