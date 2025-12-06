'use server';

import {ENDPOINT} from '@constants/endpoint';
import {AdminLogin} from '@type/Admin.type';

export const postAdminLogin = async ({loginId, password}: AdminLogin) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL}${ENDPOINT.postAdminLogin}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({loginId, password}),
    credentials: 'include',
  });

  return response;
};
