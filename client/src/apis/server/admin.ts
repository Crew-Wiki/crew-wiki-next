'use server';

import type {LoginRequest} from '@apis/generated/types';
import {ENDPOINT} from '@constants/endpoint';

export const postAdminLogin = async ({loginId, password}: LoginRequest) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL}${ENDPOINT.postAdminLogin}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({loginId, password}),
    credentials: 'include',
  });

  return response;
};
