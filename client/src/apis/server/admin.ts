'use server';

import {ENDPOINT} from '@constants/endpoint';
import {AdminLogin} from '@type/Admin.type';

export const postAdminLogin = async ({loginId, password}: AdminLogin) => {
  // 임시 백엔드 base URL이므로 추후 실제 백엔드 base URL로 변경 예정
  const response = await fetch(`TEMP_API_BASE_URL${ENDPOINT.postAdminLogin}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({loginId, password}),
    credentials: 'include',
  });

  return response;
};
