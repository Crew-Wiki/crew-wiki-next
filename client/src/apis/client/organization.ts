'use client';

import {CLIENT_ENDPOINT, ENDPOINT} from '@constants/endpoint';
import {requestDeleteClient, requestGetClient, requestPostClient, requestPutClient} from '@http/client';
import {
  GroupDocumentResponse,
  OrganizationDocumentCreateRequest,
  OrganizationDocumentUpdateRequest,
  OrganizationDocumentWithEventsResponse,
} from '@type/Group.type';

export const getOrganizationDocumentByUUIDClient = async (uuid: string) => {
  const response = await requestGetClient<OrganizationDocumentWithEventsResponse>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getOrganizationDocumentByUUID(uuid),
  });

  return response;
};

export const postOrganizationDocumentClient = async (request: OrganizationDocumentCreateRequest) => {
  const response = await requestPostClient<GroupDocumentResponse>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.postOrganizationDocument,
    body: request,
  });

  return response;
};

export const putOrganizationDocumentClient = async (request: OrganizationDocumentUpdateRequest) => {
  const response = await requestPutClient<GroupDocumentResponse>({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: CLIENT_ENDPOINT.putOrganizationDocument,
    body: request,
  });

  return response;
};

export const deleteOrganizationFromDocumentClient = async (documentUuid: string, organizationDocumentUuid: string) => {
  await requestDeleteClient({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.deleteOrganizationFromDocument(documentUuid, organizationDocumentUuid),
  });
};
