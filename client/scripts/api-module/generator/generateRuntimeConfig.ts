import type {GeneratorConfig} from '../generator.config.ts';

/**
 * 수기로 관리하는 런타임 설정 파일의 초기 템플릿.
 * 파일이 이미 있으면 제너레이터가 건드리지 않는다.
 */
export const generateRuntimeConfig = (config: GeneratorConfig): string =>
  `/**
 * 자동 생성된 API 트리가 참조하는 런타임 설정.
 *
 * 이 파일은 제너레이터가 덮어쓰지 않습니다.
 * next 의 revalidate / tags 같은 캐시 정책을 오퍼레이션 단위로 여기서 관리하세요.
 * 키는 OpenAPI 문서의 \`METHOD /path\` 표기 그대로입니다.
 */
import {CACHE} from '@constants/cache';
import type {HeadersType} from '@type/http.type';
import type {OperationArgsMap, OperationKey} from '${config.modules.operations}';

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL ?? '';

export type ServerRequestOptions = {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  headers?: HeadersType;
};

type OptionsResolver<K extends OperationKey> = (args: OperationArgsMap[K]) => ServerRequestOptions;

/** 오퍼레이션별 캐시 정책. 여기 없으면 아래 기본값이 쓰인다 */
const OPERATION_OPTIONS: {[K in OperationKey]?: OptionsResolver<K>} = {
  'GET /document': ({query}) => ({
    next: {revalidate: CACHE.time.basicRevalidate, tags: ['documents', \`page=\${query.pageNumber}\`]},
  }),
  'GET /document/uuid/{uuidText}': ({uuidText}) => ({
    next: {revalidate: CACHE.time.basicRevalidate, tags: [\`document:\${uuidText}\`]},
  }),
  'GET /document/title/{title}': ({title}) => ({
    next: {revalidate: CACHE.time.basicRevalidate, tags: [\`document:\${decodeURI(title)}\`]},
  }),
  'GET /document/uuid/{uuidText}/log': ({uuidText}) => ({
    next: {revalidate: CACHE.time.basicRevalidate, tags: [\`logs:\${uuidText}\`]},
  }),
  'GET /document/log/{logId}': ({logId}) => ({
    next: {revalidate: CACHE.time.longRevalidate, tags: [\`specificLog:\${logId}\`]},
  }),
  'GET /document/random': () => ({cache: 'no-store'}),
};

const READ_DEFAULT: ServerRequestOptions = {
  next: {revalidate: CACHE.time.basicRevalidate},
};

/** 뮤테이션은 캐시하지 않는다 */
const MUTATION_DEFAULT: ServerRequestOptions = {cache: 'no-store'};

const isRead = (operation: OperationKey) => operation.startsWith('GET ');

export const resolveServerOptions = <K extends OperationKey>(
  operation: K,
  args: OperationArgsMap[K],
  override?: ServerRequestOptions,
): ServerRequestOptions => {
  const resolver = OPERATION_OPTIONS[operation] as OptionsResolver<K> | undefined;
  const base = isRead(operation) ? READ_DEFAULT : MUTATION_DEFAULT;

  return {...base, ...resolver?.(args), ...override};
};
`;
