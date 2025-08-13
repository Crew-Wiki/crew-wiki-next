'use server';

import {CACHE} from '@constants/cache';
import {ENDPOINT} from '@constants/endpoint';
import {
  PostDocumentContent,
  WikiDocument,
  WikiDocumentExpand,
  WikiDocumentLogDetail,
  WikiDocumentLogSummary,
} from '@type/Document.type';
import {requestGetServer, requestPostServer, requestPutServer} from '@http/server';
import {PaginationParams, PaginationResponse} from '@type/General.type';
import {allDocumentsParams, documentLogsParams, recentlyParams} from '@constants/params';
import {TitleAndUUID} from '@apis/client/document';

export const getDocumentsServerWithPagination = async (params: PaginationParams) => {
  const response = await requestGetServer<PaginationResponse<WikiDocumentExpand[]>>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getDocuments,
    queryParams: params,
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getDocuments(params)]},
  });

  return response;
};

// 전체 문서의 UUID와 제목을 불러오기 위한 목적
export const getDocumentsUUIDServer = async () => {
  const response = await requestGetServer<TitleAndUUID[]>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: `${ENDPOINT.getDocumentSearch}?keyWord=`,
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getDocumentsUUID]},
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
