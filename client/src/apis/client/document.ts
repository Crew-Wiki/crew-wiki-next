'use client';

import {ENDPOINT} from '@constants/endpoint';
import {requestGetClient, requestPostClient, requestPutClient, requestDeleteClient} from '@http/client';
import {LatestWikiDocument, PostDocumentContent, WikiDocument, WikiDocumentLogSummary} from '@type/Document.type';
import {PaginationParams, PaginationResponse} from '@type/General.type';
import {Organization} from '@type/Group.type';

export const getDocumentByTitleClient = async (title: string) => {
  const response = await requestGetClient<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getDocumentByTitle(title),
  });

  return response;
};

export const getDocumentByUUIDClient = async (uuid: string) => {
  const response = await requestGetClient<LatestWikiDocument>({
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
  documentType: 'CREW' | 'ORGANIZATION';
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

export const getDocumentTitleListClient = async () => {
  const response = await requestGetClient<TitleAndUUID[]>({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: '/api/get-document-title-list',
  });

  return response;
};

export const deleteDocumentClient = async (uuid: string) => {
  await requestDeleteClient({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: '/api/delete-document',
    queryParams: {uuid},
  });
};

export const getOrganizationDocumentsByDocumentUUIDClient = async (uuid: string) => {
  const response = await requestGetClient<Organization[]>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getOrganizationDocumentsByDocumentUUID(uuid),
  });

  return response;
};
