'use client';

import {CLIENT_ENDPOINT} from '@constants/endpoint';
import {requestDeleteClientWithoutResponse} from '@http/client';

export const deleteFrontendServerCache = async () => {
  await requestDeleteClientWithoutResponse({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: CLIENT_ENDPOINT.deleteFrontendServerCache,
  });
};
