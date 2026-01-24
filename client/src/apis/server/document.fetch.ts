import {requestGetServer} from '../../http/server';
import {WikiDocumentExpand, WikiDocumentLogSummary, WikiDocument, WikiDocumentLogDetail} from '@type/Document.type';
import {PaginationParams, PaginationResponse} from '@type/General.type';
import {ENDPOINT} from '@constants/endpoint';
import {CACHE} from '@constants/cache';
import {documentLogsParams, recentlyParams, allDocumentsParams} from '@constants/params';

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
  const response = await getDocumentsServerWithPagination(allDocumentsParams);
  return response.data;
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
