'use server';

import {ENDPOINT} from '@constants/endpoint';
import {PostDocumentContent, WikiDocument} from '@type/Document.type';
import {requestPostServer, requestPutServer, requestDeleteServer} from '@http/server';
import {ViewCountByUUID} from '@type/viewCount.type';

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
