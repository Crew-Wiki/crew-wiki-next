import type {EndpointModel} from './model/endpoint.ts';

export type HttpMethodName = EndpointModel['method'];

/**
 * api-module 제너레이터 설정.
 * 경로는 모두 `client/` 기준 상대 경로다.
 */
export interface GeneratorConfig {
  /** OpenAPI 문서 위치 */
  input: string;

  /** 생성물 디렉터리. 매 실행마다 통째로 비워진다 */
  outputDir: string;

  /** 수기로 관리하는 런타임 설정 파일. 없을 때만 스캐폴딩된다 */
  runtimeConfigPath: string;

  /** 생성 코드가 import 할 모듈 경로들 */
  modules: {
    types: string;
    operations: string;
    runtimeConfig: string;
    httpServer: string;
    httpClient: string;
    httpCommon: string;
  };

  /**
   * HTTP 메서드별로 호출할 요청 함수.
   * `generic: false` 는 타입 인자를 받지 않고 항상 `void` 를 돌려주는 함수를 뜻한다.
   */
  requestFunctions: Record<HttpMethodName, {server: string; client: string; generic: boolean}>;

  emitServer: boolean;
  emitClient: boolean;

  /**
   * 스프링 스웨거는 required 를 거의 내려주지 않는다.
   * true 면 모든 프로퍼티를 필수로 취급한다.
   */
  treatPropertiesAsRequired: boolean;

  /** 시그니처에서 제외할 파라미터 위치 (쿠키/헤더는 fetch credentials 로 처리) */
  ignoreParamIn: ('header' | 'cookie')[];

  /** `GET /document` 형태의 키. 이 오퍼레이션은 서버 트리에서 제외 */
  excludeFromServer: string[];

  /** `GET /document` 형태의 키. 이 오퍼레이션은 클라이언트 트리에서 제외 */
  excludeFromClient: string[];
}

export const generatorConfig: GeneratorConfig = {
  input: 'scripts/api-module/api-docs/api-docs.json',
  outputDir: 'src/apis/generated',
  runtimeConfigPath: 'src/apis/apiConfig.ts',

  modules: {
    types: '@apis/generated/types',
    operations: '@apis/generated/operations',
    runtimeConfig: '@apis/apiConfig',
    httpServer: '@http/server',
    httpClient: '@http/client',
    httpCommon: '@http/common',
  },

  requestFunctions: {
    GET: {server: 'requestGetServer', client: 'requestGetClient', generic: true},
    POST: {server: 'requestPostServer', client: 'requestPostClient', generic: true},
    PUT: {server: 'requestPutServer', client: 'requestPutClient', generic: true},
    PATCH: {server: 'requestPatchServer', client: 'requestPatchClient', generic: true},
    // http 레이어의 delete 는 204 를 직접 처리하며 항상 void 를 돌려준다
    DELETE: {server: 'requestDeleteServer', client: 'requestDeleteClient', generic: false},
  },

  emitServer: true,
  emitClient: true,
  treatPropertiesAsRequired: true,
  ignoreParamIn: ['header', 'cookie'],

  excludeFromServer: [],
  excludeFromClient: [],
};
