'use client';

import {ENDPOINT} from '@constants/endpoint';
import {requestGet} from '@http/client';

export const generateDocumentUUID = async () => {
  const response = await requestGet<{uuid: string}>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    endpoint: ENDPOINT.generateDocumentUUID,
  });

  return response.uuid;
};
