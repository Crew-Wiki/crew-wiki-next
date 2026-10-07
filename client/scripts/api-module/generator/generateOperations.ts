import type {ApiModel, EndpointModel} from '../model/endpoint.ts';
import {AUTO_GENERATED_BANNER} from '../utils/file.ts';
import {collectTypeNames, queryTypeOf} from './renderTree.ts';

/**
 * `'GET /document/uuid/{uuidText}'` -> 그 오퍼레이션의 인자 타입.
 * apiConfig 에서 캐시 태그를 만들 때 인자 타입을 그대로 쓸 수 있게 해준다.
 */
const argsType = (endpoint: EndpointModel): string => {
  const members = endpoint.pathParams.map(param => `${param.name}: ${param.type}`);

  const queryType = queryTypeOf(endpoint);
  if (queryType) members.push(`query: ${queryType}`);

  if (endpoint.body) members.push(`body: ${endpoint.body.type}`);

  if (members.length === 0) return 'Record<string, never>';

  return `{${members.join('; ')}}`;
};

export const generateOperations = (model: ApiModel, typesModule: string): string => {
  const knownTypes = new Set(Object.keys(model.schemas));
  const imports = collectTypeNames(model.endpoints, knownTypes, {response: false});

  const lines = [AUTO_GENERATED_BANNER];

  if (imports.length > 0) lines.push(`import type {${imports.join(', ')}} from '${typesModule}';`, '');

  lines.push(
    '/** 오퍼레이션 키 -> 호출 인자. 키는 OpenAPI 문서의 `METHOD /path` 표기 그대로다 */',
    'export interface OperationArgsMap {',
    model.endpoints.map(endpoint => `  '${endpoint.key}': ${argsType(endpoint)};`).join('\n'),
    '}',
    '',
    'export type OperationKey = keyof OperationArgsMap;',
    '',
  );

  return lines.join('\n');
};
