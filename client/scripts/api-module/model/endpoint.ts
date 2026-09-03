import type {SchemaObject} from './openapi.ts';

export interface ParamModel {
  /** OpenAPI 상의 파라미터 이름 */
  name: string;

  /** TS 타입 표현 */
  type: string;

  required: boolean;

  description?: string;
}

export interface QueryModel {
  /** 쿼리 파라미터가 존재하는지 */
  has: boolean;

  /** $ref 로 넘어온 객체 쿼리 (ex. PagingRequest) */
  objectType?: string;

  /** 스칼라로 나열된 쿼리 파라미터들 */
  inlineParams: ParamModel[];
}

export interface BodyModel {
  type: string;

  required: boolean;

  /** multipart/form-data 등 JSON 이 아닌 요청 */
  isFormData: boolean;
}

export interface EndpointModel {
  /**
   * 오퍼레이션 식별자. `GET /document/uuid/{uuidText}` 형태로,
   * OpenAPI 문서의 표기를 그대로 쓴다. apiConfig 의 캐시 정책 키이기도 하다.
   */
  key: string;

  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

  path: string;

  /** 파일 분리 기준이 되는 최상위 경로 세그먼트 (ex. document) */
  group: string;

  summary?: string;

  description?: string;

  pathParams: ParamModel[];

  query: QueryModel;

  body?: BodyModel;

  /** SuccessBody 래퍼를 벗겨낸 응답 타입 */
  responseType: string;
}

export interface ApiModel {
  endpoints: EndpointModel[];

  /** 타입 파일로 방출할 스키마 (SuccessBody 래퍼는 제외됨) */
  schemas: Record<string, SchemaObject>;

  warnings: string[];
}
