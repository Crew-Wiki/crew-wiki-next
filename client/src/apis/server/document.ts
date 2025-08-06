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
import {ViewCountByUUID} from '@type/viewCount.type';

export const getDocumentsServerWithPagination = async (params: PaginationParams) => {
  const response = await requestGetServer<PaginationResponse<WikiDocumentExpand[]>>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getDocuments,
    queryParams: params,
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getDocuments(params)]},
  });

  return response;
};

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

export const postViewsFlush = async (views: ViewCountByUUID) => {
  await requestPostServer({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.postViewsFlush,
    body: views,
  });
};
