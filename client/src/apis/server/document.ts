'use server';

import {CACHE} from '@constants/cache';
import {ENDPOINT} from '@constants/endpoint';
import {
  PostDocumentBody,
  WikiDocument,
  WikiDocumentExpand,
  WikiDocumentLogDetail,
  WikiDocumentLogSummary,
} from '@type/Document.type';
import {requestGetServer, requestPostServer, requestPutServer, requestDeleteServer} from '@http/server';
import {PaginationParams, PaginationResponse} from '@type/General.type';
import {allDocumentsParams, documentLogsParams, recentlyParams} from '@constants/params';
import {ViewCountByUUID} from '@type/viewCount.type';
import {Organization} from '@type/Group.type';

export const getDocumentsServerWithPagination = async (params: PaginationParams) => {
  const response = await requestGetServer<PaginationResponse<WikiDocumentExpand[]>>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getDocuments,
    queryParams: params,
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getDocuments(params)]},
  });

  return response;
};

export const getDocumentByUUIDServer = async (uuid: string) => {
  try {
    const docs = await requestGetServer<WikiDocument>({
      baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
      endpoint: ENDPOINT.getDocumentByUUID(uuid),
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
  const response = await requestGetServer<PaginationResponse<WikiDocumentLogSummary[]>>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getDocumentLogsByUUID(uuid),
    queryParams: documentLogsParams,
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getDocumentLogsByUUID(uuid)]},
  });

  return response;
};

export const getSpecificDocumentLogServer = async (logId: number) => {
  const response = await requestGetServer<WikiDocumentLogDetail>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getSpecificDocumentLog(logId),
    next: {revalidate: CACHE.time.longRevalidate, tags: [CACHE.tag.getSpecificDocumentLog(logId)]},
  });

  return response;
};

export const getRecentlyDocumentsServer = async () => {
  const response = await getDocumentsServerWithPagination(recentlyParams);
  return response.data;
};

export const getAllDocumentsServer = async () => {
  const response = await getDocumentsServerWithPagination(allDocumentsParams);
  return response.data;
};

export const postDocumentServer = async (document: PostDocumentBody) => {
  const response = await requestPostServer<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.postDocument,
    body: document,
  });

  return response;
};

export const putDocumentServer = async (document: PostDocumentBody) => {
  const response = await requestPutServer<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.updateDocument,
    body: document,
  });

  return response;
};

export const postViewsFlush = async (viewCount: ViewCountByUUID) => {
  await requestPostServer({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.postViewsFlush,
    body: viewCount,
  });
};

export const deleteDocumentServer = async (uuid: string, cookieHeader?: string | null) => {
  const headers: Record<string, string> = {};
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader;
  }

  const response = await requestDeleteServer({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.deleteDocument(uuid),
    headers,
  });

  return response;
};

export const getOrganizationDocumentsByDocumentUUIDServer = async (uuid: string) => {
  try {
    const response = await requestGetServer<Organization[]>({
      baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
      endpoint: ENDPOINT.getOrganizationDocumentsByDocumentUUID(uuid),
      next: {revalidate: CACHE.time.basicRevalidate},
    });

    return response;
  } catch {
    return [];
  }
};
