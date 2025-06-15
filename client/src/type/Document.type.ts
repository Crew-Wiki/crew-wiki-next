export interface WikiDocument {
  documentId: number;
  title: string;
  contents: string;
  writer: string;
  generateTime: string;
}

export interface WriteDocumentContent {
  title: string;
  contents: string;
  writer: string;
  documentBytes: number;
}

export interface WikiDocumentLogSummary {
  documentBytes: number;
  generateTime: string;
  logId: number;
  version: number;
  writer: string;
}

export interface WikiDocumentLogDetail {
  contents: string;
  generateTime: string;
  logId: number;
  title: string;
  writer: string;
}

export interface UploadImageMeta {
  file: File;
  objectURL: string;
  s3URL: string;
}

export interface RecentlyDocument {
  documentId: number;
  title: string;
  generateTime: string;
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
