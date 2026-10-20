/**
 * 이 파일은 api-module 제너레이터가 자동 생성한 파일입니다.
 * 직접 수정하지 마세요. `yarn api:generate` 로 다시 생성됩니다.
 */

import {requestGetServer, requestPostServer} from '@http/server';
import {API_BASE_URL, resolveServerOptions} from '@apis/apiConfig';
import type {ServerRequestOptions} from '@apis/apiConfig';
import type {AdminResponse, LoginRequest} from '@apis/generated/types';

export const auth = {
  login: {
    /**
     * `POST /auth/login`
     */
    post: async (body: LoginRequest, options?: ServerRequestOptions): Promise<void> =>
      await requestPostServer<void>({
        baseUrl: API_BASE_URL,
        endpoint: `/auth/login`,
        body,
        ...resolveServerOptions('POST /auth/login', {body}, options),
      }),
    check: {
      /**
       * `GET /auth/login/check`
       */
      get: async (options?: ServerRequestOptions): Promise<AdminResponse> =>
        await requestGetServer<AdminResponse>({
          baseUrl: API_BASE_URL,
          endpoint: `/auth/login/check`,
          ...resolveServerOptions('GET /auth/login/check', {}, options),
        }),
    },
  },
  logout: {
    /**
     * `POST /auth/logout`
     */
    post: async (options?: ServerRequestOptions): Promise<void> =>
      await requestPostServer<void>({
        baseUrl: API_BASE_URL,
        endpoint: `/auth/logout`,
        ...resolveServerOptions('POST /auth/logout', {}, options),
      }),
  },
};
