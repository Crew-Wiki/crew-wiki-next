/**
 * 이 파일은 api-module 제너레이터가 자동 생성한 파일입니다.
 * 직접 수정하지 마세요. `yarn api:generate` 로 다시 생성됩니다.
 */

import {requestDeleteServer} from '@http/server';
import {API_BASE_URL, resolveServerOptions} from '@apis/apiConfig';
import type {ServerRequestOptions} from '@apis/apiConfig';

export const admin = {
  documents: (documentUuid: string) => ({
    /**
     * 문서 삭제
     * 문서 Uuid로 문서를 삭제합니다.
     * `DELETE /admin/documents/{documentUuid}`
     */
    delete: async (options?: ServerRequestOptions): Promise<void> =>
      await requestDeleteServer({
        baseUrl: API_BASE_URL,
        endpoint: `/admin/documents/${documentUuid}`,
        ...resolveServerOptions('DELETE /admin/documents/{documentUuid}', {documentUuid}, options),
      }),
  }),
};
