/**
 * 이 파일은 api-module 제너레이터가 자동 생성한 파일입니다.
 * 직접 수정하지 마세요. `yarn api:generate` 로 다시 생성됩니다.
 */

'use client';

import {requestGetClient, requestPostClient} from '@http/client';
import {API_BASE_URL} from '@apis/apiConfig';
import type {AdminResponse, LoginRequest} from '@apis/generated/types';

export const auth = {
  login: {
    /**
     * `POST /auth/login`
     */
    post: async (body: LoginRequest): Promise<void> =>
      await requestPostClient<void>({
        baseUrl: API_BASE_URL,
        endpoint: `/auth/login`,
        body,
      }),
    check: {
      /**
       * `GET /auth/login/check`
       */
      get: async (): Promise<AdminResponse> =>
        await requestGetClient<AdminResponse>({
          baseUrl: API_BASE_URL,
          endpoint: `/auth/login/check`,
        }),
    },
  },
  logout: {
    /**
     * `POST /auth/logout`
     */
    post: async (): Promise<void> =>
      await requestPostClient<void>({
        baseUrl: API_BASE_URL,
        endpoint: `/auth/logout`,
      }),
  },
};
