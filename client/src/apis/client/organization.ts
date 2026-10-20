import {OrganizationDocumentResponse, OrganizationDocumentUpdateRequest} from '@apis/generated/types';
import {CLIENT_ENDPOINT} from '@constants/endpoint';
import {requestPostClientWithoutResponse, requestPutClient} from '@http/client';

export const putOrganizationDocumentClient = async (request: OrganizationDocumentUpdateRequest) => {
  const response = await requestPutClient<OrganizationDocumentResponse>({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: CLIENT_ENDPOINT.putOrganizationDocument,
    body: request,
  });

  return response;
};

export const revalidateOrganizationDocumentClient = async (organizationDocumentUuids: string[]) => {
  await requestPostClientWithoutResponse({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: CLIENT_ENDPOINT.revalidateOrganizationDocument,
    body: {organizationDocumentUuids},
  });
};
