import type {SchemaObject} from '../model/openapi.ts';

const REF_PREFIX = '#/components/schemas/';

export const refName = (schema: SchemaObject | undefined): string | undefined => {
  if (!schema?.$ref) return undefined;
  if (!schema.$ref.startsWith(REF_PREFIX)) return undefined;

  return schema.$ref.slice(REF_PREFIX.length);
};

export const resolveRef = (
  schemas: Record<string, SchemaObject>,
  schema: SchemaObject | undefined,
): SchemaObject | undefined => {
  const name = refName(schema);
  if (!name) return schema;

  const resolved = schemas[name];
  if (!resolved) throw new Error(`정의되지 않은 스키마 참조: ${schema?.$ref}`);

  return resolved;
};

/** `{ data, code: 'SUCCESS' }` 형태의 공통 응답 래퍼인지 */
export const isSuccessWrapper = (schema: SchemaObject | undefined): boolean => {
  const properties = schema?.properties;
  if (!properties) return false;

  return 'data' in properties && 'code' in properties;
};

export interface UnwrappedResponse {
  /** 언랩된 실제 데이터 스키마. 본문이 없으면 undefined */
  schema?: SchemaObject;

  /** SuccessBody 래퍼를 벗겨냈는지. false 면 http 레이어의 `.data` 접근과 어긋난다 */
  wrapped: boolean;

  wrapperName?: string;
}

/**
 * http 레이어(requestGetServer 등)가 이미 `response.data` 를 반환하므로
 * 응답 타입도 래퍼를 벗긴 안쪽 타입으로 맞춘다.
 */
export const unwrapResponse = (
  schemas: Record<string, SchemaObject>,
  responseSchema: SchemaObject | undefined,
): UnwrappedResponse => {
  if (!responseSchema) return {wrapped: false};

  const wrapperName = refName(responseSchema);
  const resolved = resolveRef(schemas, responseSchema);

  if (!isSuccessWrapper(resolved)) return {schema: responseSchema, wrapped: false, wrapperName};

  return {schema: resolved?.properties?.data, wrapped: true, wrapperName};
};

/** 응답 래퍼로만 쓰이는 스키마는 타입 파일에서 제외한다 */
export const collectWrapperNames = (schemas: Record<string, SchemaObject>): Set<string> => {
  const wrappers = new Set<string>();

  for (const [name, schema] of Object.entries(schemas)) {
    if (isSuccessWrapper(schema)) wrappers.add(name);
  }

  return wrappers;
};
