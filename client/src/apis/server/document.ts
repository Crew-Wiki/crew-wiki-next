'use server';

import {CACHE} from '@constants/cache';
import {ENDPOINT} from '@constants/endpoint';
import {
  PostDocumentContent,
  RecentlyDocument,
  WikiDocument,
  WikiDocumentExpand,
  WikiDocumentLogDetail,
  WikiDocumentLogSummary,
} from '@type/Document.type';
import {requestGetServer, requestPostServer, requestPutServer} from '@http/server';
import {PaginationResponse} from '@type/General.type';

export const getDocumentByTitleServer = async (title: string) => {
  try {
    const docs = await requestGetServer<WikiDocument>({
      baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
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

export const getDocumentByUUIDServer = async (uuid: string) => {
  try {
    const docs = await requestGetServer<WikiDocument>({
      baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
      endpoint: `${ENDPOINT.getDocumentByUUID}/${uuid}`,
      next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getDocumentByUUID(uuid)]},
    });

    return docs;
  } catch (error) {
    if (error instanceof Error) {
      return null;
    }
  }
};

export const getDocumentLogsByUUIDServer = async (uuid: string) => {
  const logs = await requestGetServer<WikiDocumentLogSummary[]>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getDocumentLogsByUUID(uuid),
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getDocumentLogsByUUID(uuid)]},
  });

  return logs.sort((a: WikiDocumentLogSummary, b: WikiDocumentLogSummary) =>
    a.generateTime <= b.generateTime ? 1 : -1,
  );
};

export const getSpecificDocumentLogServer = async (logId: number) => {
  const response = await requestGetServer<WikiDocumentLogDetail>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getSpecificDocumentLog(logId),
    next: {revalidate: CACHE.time.longRevalidate, tags: [CACHE.tag.getSpecificDocumentLog(logId)]},
  });

  return response;
};

interface RecentlyDocumentsResponse {
  documents: RecentlyDocument[];
}

export const getRecentlyDocumentsServer = async () => {
  const documents = await requestGetServer<RecentlyDocumentsResponse>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getRecentlyDocuments,
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getRecentlyDocuments]},
  });

  return documents;
};

export const searchDocumentServer = async (referQuery: string) => {
  const titles = await requestGetServer<string[]>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getDocumentSearch,
    cache: 'no-cache',
    queryParams: {
      keyWord: referQuery,
    },
  });

  return titles;
};

export const getAllDocumentsServer = async () => {
  const totalSize = (await searchDocumentServer('')).length; // 전체 문서의 길이를 알기 위해

  const documents = await requestGetServer<PaginationResponse<WikiDocumentExpand[]>>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getAllDocuments,
    queryParams: {
      pageNumber: 0,
      pageSize: totalSize,
    },
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getAllDocuments]},
  });

  return documents.data;
};

export const postDocumentServer = async (document: PostDocumentContent) => {
  const response = await requestPostServer<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.postDocument,
    body: document,
  });

  return response;
};

export const putDocumentServer = async (document: PostDocumentContent) => {
  const response = await requestPutServer<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.updateDocument,
    body: document,
  });

  return response;
};
