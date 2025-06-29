'use server';

import {CACHE} from '@constants/cache';
import {ENDPOINT} from '@constants/endpoint';
import {RecentlyDocument, WikiDocument, WikiDocumentLogDetail, WikiDocumentLogSummary} from '@type/Document.type';
import {requestGetServer} from '@http/server';

export const getDocumentByTitle = async (title: string) => {
  try {
    const docs = await requestGetServer<WikiDocument>({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      endpoint: `${ENDPOINT.getDocumentByTitle}/${title}`,
      next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getDocumentByTitle(title)]},
    });

    return docs;
  } catch (error) {
    if (error instanceof Error) {
      return null;
    }
  }
};

export const getDocumentLogsByTitle = async (title: string) => {
  const logs = await requestGetServer<WikiDocumentLogSummary[]>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    endpoint: ENDPOINT.getDocumentLogsByTitle(title),
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getDocumentLogsByTitle(title)]},
  });

  return logs.sort((a: WikiDocumentLogSummary, b: WikiDocumentLogSummary) =>
    a.generateTime <= b.generateTime ? 1 : -1,
  );
};

export const getSpecificDocumentLog = async (logId: number) => {
  const response = await requestGetServer<WikiDocumentLogDetail>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    endpoint: ENDPOINT.getSpecificDocumentLog(logId),
    next: {revalidate: CACHE.time.longRevalidate, tags: [CACHE.tag.getSpecificDocumentLog(logId)]},
  });

  return response;
};

export const getRandomDocument = async () => {
  const docs = await requestGetServer<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    endpoint: ENDPOINT.getRandomDocument,
    cache: 'no-cache',
  });

  return docs.title;
};

interface RecentlyDocumentsResponse {
  documents: RecentlyDocument[];
}

export const getRecentlyDocuments = async () => {
  const {documents} = await requestGetServer<RecentlyDocumentsResponse>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    endpoint: ENDPOINT.getRecentlyDocuments,
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getRecentlyDocuments]},
  });

  return documents;
};

// 요청할 때 필요한 데이터
export interface PostDocumentContent {
  title: string;
  contents: string;
  writer: string;
  documentBytes: number;
  uuid: string;
}

export const searchDocument = async (referQuery: string) => {
  const titles = await requestGetServer<string[]>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    endpoint: ENDPOINT.getDocumentSearch,
    cache: 'no-cache',
    queryParams: {
      keyWord: referQuery,
    },
  });

  return titles;
};
