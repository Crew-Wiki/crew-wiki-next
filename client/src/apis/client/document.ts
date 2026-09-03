import {CLIENT_ENDPOINT} from '@constants/endpoint';
import {requestDeleteClient, requestGetClient, requestPostClient, requestPutClient} from '@http/client';
import {
  CrewDocumentCreateRequest,
  DocumentResponse,
  DocumentSearchResponse,
  DocumentUpdateRequest,
} from '@apis/generated/types';

export const postDocumentClient = async (document: CrewDocumentCreateRequest) => {
  const newDocument = await requestPostClient<DocumentResponse>({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: CLIENT_ENDPOINT.postDocument,
    body: document,
  });

  return newDocument;
};

export const putDocumentClient = async (document: DocumentUpdateRequest) => {
  const editDocument = await requestPutClient<DocumentResponse>({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: CLIENT_ENDPOINT.putDocument,
    body: document,
  });

  return editDocument;
};

export const getDocumentTitleListClient = async () => {
  const response = await requestGetClient<DocumentSearchResponse[]>({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: CLIENT_ENDPOINT.getDocumentTitleList,
  });

  return response;
};

export const deleteDocumentClient = async (uuid: string) => {
  await requestDeleteClient({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: CLIENT_ENDPOINT.deleteDocument,
    queryParams: {uuid},
  });
};
