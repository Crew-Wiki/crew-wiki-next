'use client';

import {requestDeleteClientWithoutResponse} from '@http/client';

export const deleteFrontendServerCache = async () => {
  await requestDeleteClientWithoutResponse<null>({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: '/api/delete-frontend-server-cache',
  });
};
