'use client';

import {ENDPOINT} from '@constants/endpoint';
import {requestPostClient} from '@http/client';
import {GroupDocumentResponse, OrganizationDocumentCreateRequest} from '@type/Group.type';

export const postOrganizationDocumentClient = async (request: OrganizationDocumentCreateRequest) => {
  const response = await requestPostClient<GroupDocumentResponse>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.postOrganizationDocument,
    body: request,
  });

  return response;
};
