'use server';

import {ENDPOINT} from '@constants/endpoint';
import {
  GroupDocumentResponse,
  OrganizationDocumentCreateRequest,
  OrganizationDocumentUpdateRequest,
  OrganizationDocumentWithEventsResponse,
} from '@type/Group.type';
import {requestGetServer, requestPostServer, requestPutServer} from '@http/server';

export const getOrganizationDocumentByUUIDServer = async (uuid: string) => {
  const response = await requestGetServer<OrganizationDocumentWithEventsResponse>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getOrganizationDocumentByUUID(uuid),
  });

  return response;
};

export const postOrganizationDocumentServer = async (documentData: OrganizationDocumentCreateRequest) => {
  const response = await requestPostServer<GroupDocumentResponse>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.postOrganizationDocument,
    body: documentData,
  });

  return response;
};

export const putOrganizationDocumentServer = async (documentData: OrganizationDocumentUpdateRequest) => {
  const response = await requestPutServer<GroupDocumentResponse>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.putOrganizationDocument,
    body: documentData,
  });

  return response;
};
