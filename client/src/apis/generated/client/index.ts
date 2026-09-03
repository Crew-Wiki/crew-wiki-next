/**
 * 이 파일은 api-module 제너레이터가 자동 생성한 파일입니다.
 * 직접 수정하지 마세요. `yarn api:generate` 로 다시 생성됩니다.
 */

'use client';

import {admin} from './admin';
import {auth} from './auth';
import {document} from './document';
import {graph} from './graph';
import {organization} from './organization';
import {organizationEvents} from './organizationEvents';

/** 클라이언트 컴포넌트에서 쓰는 API 트리 */
export const api = {
  admin,
  auth,
  document,
  graph,
  organization,
  organizationEvents,
};
