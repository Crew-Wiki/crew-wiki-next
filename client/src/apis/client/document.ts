'use client';

import {ENDPOINT} from '@constants/endpoint';
import {requestGetClient, requestPostClient, requestPutClient} from '@http/client';
import {PostDocumentContent, WikiDocument, WikiDocumentLogSummary} from '@type/Document.type';
import {PaginationParams, PaginationResponse} from '@type/General.type';

export const getDocumentByTitleClient = async (title: string) => {
  const response = await requestGetClient<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getDocumentByTitle(title),
  });

  return response;
};

export const getDocumentByUUIDClient = async (uuid: string) => {
  const response = await requestGetClient<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getDocumentByUUID(uuid),
  });

  return response;
};

export const getRandomDocumentClient = async () => {
  const document = await requestGetClient<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getRandomDocument,
  });

  return document;
};

export type TitleAndUUID = {
  title: string;
  uuid: string;
};

export const getSearchDocumentClient = async (query: string) => {
  const response = await requestGetClient<TitleAndUUID[]>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getDocumentSearch,
    queryParams: {
      keyWord: query,
    },
  });

  return response;
};

export const getDocumentLogsByUUIDClient = async (uuid: string, params: PaginationParams) => {
  const response = await requestGetClient<PaginationResponse<WikiDocumentLogSummary[]>>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getDocumentLogsByUUID(uuid),
    queryParams: params,
  });

  return response;
};

export const postDocumentClient = async (document: PostDocumentContent) => {
  const newDocument = await requestPostClient<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: '/api/post-document',
    body: document,
  });

  return newDocument;
};

export const putDocumentClient = async (document: PostDocumentContent) => {
  const editDocument = await requestPutClient<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: '/api/put-document',
    body: document,
  });

  return editDocument;
};
