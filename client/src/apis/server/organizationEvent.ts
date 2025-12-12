'use server';

import {ENDPOINT} from '@constants/endpoint';
import {EventFormData, OrganizationEventCreateResponse} from '@type/Event.type';
import {requestPostServer, requestDeleteServer} from '@http/server';

export const postOrganizationEventServer = async (eventData: EventFormData) => {
  const response = await requestPostServer<OrganizationEventCreateResponse>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.postOrganizationEvent,
    body: eventData,
  });

  return response;
};

export const deleteOrganizationEventServer = async (organizationEventUuid: string) => {
  await requestDeleteServer({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.deleteOrganizationEvent(organizationEventUuid),
  });
};