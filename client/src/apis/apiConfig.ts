/**
 * 자동 생성된 API 트리가 참조하는 런타임 설정.
 *
 * 이 파일은 제너레이터가 덮어쓰지 않습니다.
 * next 의 revalidate / tags 같은 캐시 정책을 오퍼레이션 단위로 여기서 관리하세요.
 * 키는 OpenAPI 문서의 `METHOD /path` 표기 그대로입니다.
 */
import {CACHE} from '@constants/cache';
import type {HeadersType} from '@type/http.type';
import type {OperationArgsMap, OperationKey} from '@apis/generated/operations';

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL ?? '';

export type ServerRequestOptions = {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  headers?: HeadersType;
};

type OptionsResolver<K extends OperationKey> = (args: OperationArgsMap[K]) => ServerRequestOptions;
type ReadOperationKey = Extract<OperationKey, `GET ${string}`>;

const READ_DEFAULT: ServerRequestOptions = {
  next: {revalidate: CACHE.time.basicRevalidate},
};

/** GET은 캐시 정책을 반드시 등록하고, 뮤테이션은 필요할 때만 재정의한다. */
const OPERATION_OPTIONS: {[K in ReadOperationKey]: OptionsResolver<K>} & {
  [K in Exclude<OperationKey, ReadOperationKey>]?: OptionsResolver<K>;
} = {
  'GET /auth/login/check': () => ({cache: 'no-store'}),
  'GET /document': ({query}) => ({
    next: {
      revalidate: CACHE.time.basicRevalidate,
      // 백엔드가 sortDirection 을 enum 으로 내려주지 않아 생성 타입은 string 이다.
      // 프론트가 좁혀 쓰는 PaginationParams 에 맞추려면 여기서 단언이 필요하다.
      tags: [CACHE.tag.getDocuments({...query, sortDirection: query.sortDirection as 'ASC' | 'DESC'})],
    },
  }),
  'GET /document/titles': () => ({
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getDocumentTitles]},
  }),
  'GET /document/uuid/{uuidText}': ({uuidText}) => ({
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getDocumentByUUID(uuidText)]},
  }),
  'GET /document/title/{title}': ({title}) => ({
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getDocumentByTitle(title)]},
  }),
  'GET /document/uuid/{uuidText}/log': ({uuidText}) => ({
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getDocumentLogsByUUID(uuidText)]},
  }),
  'GET /document/log/{logId}': ({logId}) => ({
    next: {revalidate: CACHE.time.longRevalidate, tags: [CACHE.tag.getSpecificDocumentLog(logId)]},
  }),
  'GET /document/random': () => ({cache: 'no-store'}),
  'GET /document/{uuidText}/organization-documents': ({uuidText}) => ({
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getOrganizationsByDocumentUUID(uuidText)]},
  }),
  'GET /organization/uuid/{uuidText}': ({uuidText}) => ({
    next: {revalidate: CACHE.time.basicRevalidate, tags: [CACHE.tag.getOrganizationDocumentByUUID(uuidText)]},
  }),
  // 별도 무효화 태그가 없는 조회는 기존 시간 기반 캐시 정책을 유지한다.
  'GET /document/crews': () => READ_DEFAULT,
  'GET /document/search': () => READ_DEFAULT,
  'GET /document/title/{title}/uuid': () => READ_DEFAULT,
  'GET /graph': () => READ_DEFAULT,
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
  const options = isRead(operation) ? resolver!(args) : {...MUTATION_DEFAULT, ...resolver?.(args)};

  return {...options, ...override};
};
