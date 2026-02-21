# API, 훅, 상태관리

> SKILL.md의 지원 파일입니다. 섹션 5-8의 상세 내용을 담고 있습니다.

---

## 5. API 요청 아키텍처

### 데이터 흐름 전체도

```
[읽기 - 서버 컴포넌트]
  page.tsx (async)
    → apis/server/*.ts        (requestGetServer + 캐시 설정)
      → 백엔드 서버

[읽기 - 클라이언트 컴포넌트]
  Component
    → hooks/fetch/useGet*.ts  (useFetch 래핑)
      → apis/client/*.ts      (requestGetClient)
        → 백엔드 서버

[쓰기 - 클라이언트 → BFF → 백엔드]
  Component
    → hooks/mutation/*.ts     (useMutation 래핑)
      → apis/client/*.ts      → app/api/*/route.ts (BFF)
        → apis/server/*.ts    → 백엔드 서버
        → revalidateTag()     (캐시 무효화)
```

> **핵심**: 쓰기(POST/PUT/DELETE)는 반드시 Route Handler(BFF)를 경유합니다. `revalidateTag()`가 서버에서만 동작하기 때문입니다.

### 처음 API를 파악하는 방법

이 프로젝트에서 API를 처음 접한다면, 아래 순서로 탐색하세요.

**1단계: 백엔드에 어떤 API가 있는지 확인**

```ts
// constants/endpoint.ts — 모든 백엔드 엔드포인트가 여기에 정의됨
export const ENDPOINT = {
  // Document
  postDocument: '/document',
  getDocumentByUUID: (uuid: string) => `/document/uuid/${uuid}`,
  getDocumentByTitle: (title: string) => `/document/title/${title}`,
  getDocumentSearch: '/document/search',
  getDocumentLogsByUUID: (uuid: string) => `/document/uuid/${uuid}/log`,
  getPresignedUrl: '/upload',
  // Organization, Admin 등...
} as const;
```

> 이 파일 하나만 보면 백엔드가 제공하는 전체 API 목록을 알 수 있습니다.

**2단계: 해당 API를 호출하는 함수 찾기**

엔드포인트를 사용하는 함수는 두 곳에 있습니다:

```
apis/server/document.ts  → 서버 컴포넌트에서 호출 (캐시 설정 포함)
apis/client/document.ts  → 클라이언트 컴포넌트에서 호출
```

예를 들어 `ENDPOINT.getDocumentByUUID`를 검색하면:
- `apis/server/document.ts`의 `getDocumentByUUIDServer()` — 서버에서 ISR 캐시와 함께 호출
- `apis/client/document.ts`의 `getDocumentByUUIDClient()` — 클라이언트에서 최신 데이터 호출

**3단계: 그 함수를 사용하는 훅 또는 페이지 찾기**

```
Server API → page.tsx에서 직접 호출    (예: getDocumentByUUIDServer)
Client API → hooks/fetch/에서 래핑      (예: useGetDocumentByTitle)
Client API → hooks/mutation/에서 래핑   (예: usePostDocument)
```

**4단계: 새 API를 연동하고 싶을 때**

읽기(GET)인지 쓰기(POST/PUT/DELETE)인지에 따라 경로가 다릅니다:

```
[읽기 - 서버 컴포넌트에서 사용할 때]
  endpoint.ts에 추가 → apis/server/ 함수 작성 (캐시 설정) → page.tsx에서 호출

[읽기 - 클라이언트에서 사용할 때]
  endpoint.ts에 추가 → apis/client/ 함수 작성 → hooks/fetch/ 훅 작성 → 컴포넌트에서 사용

[쓰기]
  endpoint.ts에 추가
    → apis/server/ 함수 작성
    → app/api/ Route Handler 작성 (revalidateTag 포함)
    → apis/client/ 함수 작성 (Route Handler 호출)
    → hooks/mutation/ 훅 작성
    → 컴포넌트에서 사용
```

> SKILL.md 섹션 13의 체크리스트에서 각 단계의 상세 순서를 확인할 수 있습니다.

### API 함수 네이밍 규칙

| 구분 | 패턴 | 예시 |
|------|------|------|
| Client API | `{HTTP동사}{도메인}{대상}Client` | `getDocumentByTitleClient`, `postDocumentClient` |
| Server API | `{HTTP동사}{도메인}{대상}Server` | `getDocumentByUUIDServer`, `postDocumentServer` |

| 용도 | baseUrl 환경변수 |
|------|-----------------|
| 백엔드 직접 호출 (읽기) | `NEXT_PUBLIC_BACKEND_SERVER_BASE_URL` |
| Route Handler 경유 (쓰기) | `NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL` |

### Client API 함수

```ts
// apis/client/document.ts
'use client';

import { requestGetClient, requestPostClient } from '@http/client';
import { ENDPOINT } from '@constants/endpoint';
import { WikiDocument, PostDocumentContent } from '@type/Document.type';

// GET: 백엔드 직접 호출
export const getDocumentByTitleClient = async (title: string) => {
  return await requestGetClient<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getDocumentByTitle(title),
  });
};

// GET: queryParams
export const getSearchDocumentClient = async (query: string) => {
  return await requestGetClient<TitleAndUUID[]>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getDocumentSearch,
    queryParams: { keyWord: query },
  });
};

// POST: Route Handler(BFF) 경유
export const postDocumentClient = async (document: PostDocumentContent) => {
  return await requestPostClient<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_FRONTEND_SERVER_BASE_URL,
    endpoint: '/api/post-document',
    body: document,
  });
};
```

### Server API 함수

```ts
// apis/server/document.ts
'use server';

import { requestGetServer, requestPostServer } from '@http/server';
import { ENDPOINT } from '@constants/endpoint';
import { CACHE } from '@constants/cache';
import { WikiDocument } from '@type/Document.type';

// GET: ISR 캐시 적용
export const getDocumentByUUIDServer = async (uuid: string) => {
  try {
    return await requestGetServer<WikiDocument>({
      baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
      endpoint: ENDPOINT.getDocumentByUUID(uuid),
      next: {
        revalidate: CACHE.time.basicRevalidate,
        tags: [CACHE.tag.getDocumentByUUID(uuid)],
      },
    });
  } catch (error) {
    if (error instanceof Error) return null;
  }
};

// POST: 캐시 없음
export const postDocumentServer = async (document: PostDocumentContent) => {
  return await requestPostServer<WikiDocument>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.postDocument,
    body: document,
  });
};
```

### Route Handler (BFF)

```ts
// app/api/post-document/route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { postDocumentServer } from '@apis/server/document';
import { CACHE } from '@constants/cache';
import { ApiResponseType } from '@type/http.type';

const postDocument = async (document: PostDocumentContent) => {
  const response = await postDocumentServer(document);
  revalidateTag(CACHE.tag.getRecentlyDocuments);
  revalidateTag(CACHE.tag.getDocumentByUUID(document.uuid));
  revalidateTag(CACHE.tag.getDocumentLogsByUUID(document.uuid));
  return response;
};

export const POST = async (request: NextRequest) => {
  const document: PostDocumentContent = await request.json();

  try {
    const createdDocument = await postDocument(document);
    const response: ApiResponseType<WikiDocument> = {
      data: createdDocument,
      code: 'SUCCESS',
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponseType<null> = {
      data: null,
      code: 'ERROR',
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
    return NextResponse.json(response, { status: 500 });
  }
};
```

**Route Handler 규칙**:

| 항목 | 규칙 |
|------|------|
| 디렉토리명 | `kebab-case` (예: `post-document`) |
| 지시어 | `'use server'` |
| 핸들러 | 대문자 named export (`POST`, `GET`, `PUT`, `DELETE`) |
| 성공 응답 | `{ data: T, code: 'SUCCESS' }` |
| 실패 응답 | `{ data: null, code: 'ERROR', message }` |
| 캐시 무효화 | 여기서만 `revalidateTag()` 호출 |

### 이미지 업로드 (Presigned URL 패턴)

S3에 직접 업로드하는 특수 패턴입니다. BFF를 경유하지 않습니다.

```ts
// apis/client/images.ts
'use client';

// S3 업로드 분리 함수
const uploadImageToS3 = async (uploadImageKey: string, image: File) => {
  // 1. 백엔드에서 Presigned URL 발급
  const {url} = await requestGetClient<{url: string}>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: `${ENDPOINT.getPresignedUrl}/${uploadImageKey}`,
  });

  // 2. S3에 직접 PUT (fetch 직접 사용, 커스텀 헤더 포함)
  const response = await fetch(url, {
    method: 'PUT',
    body: image,
    headers: {
      'Content-Type': 'image/jpeg',
      'x-amz-meta-filetype': 'image/jpeg',
      'x-amz-meta-content-type': 'image/jpeg',
    },
  });

  if (!response.ok) throw new Error('이미지 업로드 중에 문제가 발생했습니다.');
};

export async function uploadImage(documentUUID: string, imageFile: File) {
  const randomFileName = Math.random().toString(36).substr(2, 11);
  const resizedImage = await resizeFile(imageFile);       // 640x640, JPEG 70%
  const extension = resizedImage.type.split('/')[1];      // 확장자 동적 결정
  const uploadImageKey = `${documentUUID}/${randomFileName}.${extension}`;

  if (documentUUID === '') throw new Error('이미지 업로드 중에 문제가 발생했습니다.');

  await uploadImageToS3(uploadImageKey, resizedImage);

  // 3. CloudFront CDN URL 반환
  return `${process.env.NEXT_PUBLIC_IMAGE_CLOUDFRONT_DOMAIN}/${uploadImageKey}`;
}
```

### 엔드포인트 상수

```ts
// constants/endpoint.ts
export const ENDPOINT = {
  postDocument: '/document',                                         // 정적
  getDocumentByTitle: (title: string) => `/document/title/${title}`, // 동적
  getDocumentByUUID: (uuid: string) => `/document/uuid/${uuid}`,
  getDocumentSearch: '/document/search',
  deleteDocument: (uuid: string) => `/admin/documents/${uuid}`,
  postAdminLogin: '/auth/login',
} as const;
```

---

## 6. 커스텀 훅

### useFetch (조회 기본 훅)

```ts
useFetch<T>(
  fetchFunction: () => Promise<T>,
  options?: { enabled?: boolean }    // 기본: { enabled: true }
)
// 반환: { data, isLoading, errorMessage, refetch, setData }
```

### 조회 훅 패턴 (hooks/fetch/)

```ts
// 파라미터 있음 → useCallback 필수
export const useGetDocumentByTitle = (title: string) => {
  const getData = useCallback(() => getDocumentByTitleClient(title), [title]);
  const { data } = useFetch<WikiDocument>(getData);
  return { document: data };
};

// 파라미터 없음 → 함수 레퍼런스 직접 전달
export const useGetDocumentTitleList = () => {
  const { data } = useFetch<TitleAndUUID[]>(getDocumentTitleListClient);
  return {
    data: data ?? [],
    titles: data?.map(v => v.title) ?? [],
  };
};

// 디바운스 검색
const useSearchDocumentByQuery = (query: string, options?: { enabled?: boolean }) => {
  const searchFn = useCallback(() => getSearchDocumentClient(query), [query]);
  const { data, refetch } = useFetch(searchFn, { enabled: options?.enabled });

  const searchIfValid = useCallback(() => {
    if (query.trim() !== '' && /^[가-힣()0-9]*$/.test(query)) refetch();
  }, [query, refetch]);

  const debouncedSearch = useDebounce(searchIfValid, 100);

  useEffect(() => { debouncedSearch(); }, [debouncedSearch, query]);

  return { titles: data ?? [] };
};

// 무한 스크롤 (useFetch 미사용, 직접 구현)
export const useGetDocumentLogs = (uuid: string, initialData: Log[], totalPage: number) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<Log[]>(initialData);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getDocumentLogsByUUIDClient(uuid, { ... });
      setData(prev => [...prev, ...response.data]);
    };
    if (page > 0) fetchData();
  }, [page, uuid]);

  const fetchNextPage = () => {
    if (page >= totalPage) return;
    setPage(prev => prev + 1);
  };

  return { logs: data, fetchNextPage };
};
```

### useMutation (변경 기본 훅)

```ts
useMutation<TVariables, TData>({
  mutationFn: (variables: TVariables) => Promise<TData>,
  onMutate?: (variables) => void,        // 요청 직전
  onSuccess?: (data, variables) => void, // 성공
  onError?: (error, variables) => void,  // 실패
  onSettled?: (data, variables) => void, // 항상 (finally)
})
// 반환: { mutate, data, isPending, errorMessage }
```

### 뮤테이션 훅 패턴 (hooks/mutation/)

```ts
export const usePostDocument = () => {
  const router = useRouter();
  const addTitle = useTrie(state => state.addTitle);
  const {trackDocumentCreate} = useAmplitude();   // Amplitude 트래킹 (섹션 15 참고)

  const { mutate, isPending } = useMutation<PostDocumentContent, WikiDocument>({
    mutationFn: postDocumentClient,
    onSuccess: document => {
      trackDocumentCreate(document.title, document.documentUUID);
      addTitle(document.title, document.documentUUID);
      router.push(route.goWiki(document.documentUUID));
      router.refresh();
    },
  });

  return {
    postDocument: mutate,       // 도메인 이름으로 rename
    isPostPending: isPending,   // prefix로 구분
  };
};
```

### 훅 네이밍

| 분류 | 패턴 | 예시 |
|------|------|------|
| 조회 | `useGet{도메인}{By조건}` | `useGetDocumentByTitle` |
| 검색 | `useSearch{도메인}By{조건}` | `useSearchDocumentByQuery` |
| 생성 | `usePost{도메인}` | `usePostDocument` |
| 수정 | `usePut{도메인}` | `usePutDocument` |
| 업로드 | `useUpload{도메인}` | `useUploadImage` |
| 유틸 | `use{기능}` | `useDebounce` |

**파일 위치**: `hooks/fetch/` (조회) · `hooks/mutation/` (변경) · `hooks/` 루트 (유틸)

---

## 7. 상태관리 (Zustand)

### 스토어 작성

```ts
// store/document.ts
import { create } from 'zustand';

// 1. State와 Action 타입 분리
type State = {
  values: FieldType;
  errorMessages: Record<Field, ErrorMessage>;
  uuid: string;
  isImageUploadPending: boolean;
  originalVersion: number;
};

type Action = {
  setInit: (initial: FieldType, uuid: string | null, version?: number) => void;
  onChange: (value: string, field: Field) => void;
  onBlur: (value: string, field: Field, list?: string[]) => void;
  reset: () => void;
  updateImageUploadPending: (isPending: boolean) => void;
};

// 2. 초기값 별도 선언
const initialValue: State = {
  values: { title: '', writer: '', contents: '' },
  errorMessages: { title: null, writer: null, contents: null },
  uuid: '',
  isImageUploadPending: false,
  originalVersion: 0,
};

// 3. create<State & Action> 교집합 타입
export const useDocument = create<State & Action>(set => ({
  ...initialValue,

  setInit: (initial, uuid, version) =>
    set({
      values: initial,
      uuid: uuid ? uuid : crypto.randomUUID(),
      originalVersion: version ? version : 0,
    }),

  onChange: (value, field) => {
    const validate = validators.get(field)?.validateOnChange;
    if (!validate) {
      set(state => ({ values: { ...state.values, [field]: value } }));
      return;
    }
    const {errorMessage, reset} = validate(value);
    set(state => ({
      errorMessages: { ...state.errorMessages, [field]: errorMessage },
      values: { ...state.values, [field]: errorMessage ? (reset?.(value) ?? value) : value },
    }));
  },

  onBlur: (value, field, list) => { /* validators Map으로 필드별 검증 */ },

  updateImageUploadPending: (isPending) => set({ isImageUploadPending: isPending }),

  reset: () => set(initialValue),
}));
```

### 스토어 사용

```tsx
// 셀렉터로 개별 선택 (리렌더링 최적화)
const title = useDocument(state => state.values.title);
const setInit = useDocument(action => action.setInit);

// get()으로 액션 내 현재 상태 읽기
export const useTrie = create<State & Action>((set, get) => ({
  trie: new Trie(),
  titles: [],
  addTitle: (title, uuid) => {
    const { trie, titles } = get();
    trie.add(title, uuid);
    set({ titles: [...titles, { title, uuid }] });
  },
}));

// 페이지 초기화/cleanup 필수 패턴
useEffect(() => {
  setInit(document);
  return () => reset();
}, [document, setInit, reset]);
```

---

## 8. 타입 정의

### 파일 네이밍

`{PascalCase도메인}.type.ts` — 복수형 없음

```
type/
  Document.type.ts     # WikiDocument, PostDocumentContent
  General.type.ts      # PaginationResponse, PaginationParams
  http.type.ts         # ResponseType, ApiResponseType
  PageParams.type.ts   # UUIDParams, TitleParams
```

### 선언 규칙

```ts
// 도메인 모델 → interface
export interface WikiDocument {
  documentId: number;
  documentUUID: string;
  title: string;
  contents: string;
  writer: string;
  generateTime: string;
}

// 상속 → extends
export interface LatestWikiDocument extends WikiDocument {
  latestVersion: number;
}

// 유틸리티 조합 → type + Omit
export type WikiDocumentExpand = Omit<WikiDocument, 'documentUUID' | 'documentId'> & {
  uuid: string;
  id: number;
  documentBytes: number;
  viewCount: number;
};

// 단순 별칭/유니온/제네릭 → type
export type ErrorMessage = string | null;
export type PaginationResponse<T> = { page: number; totalPage: number; data: T };

// 상수 파생 타입
export type SortType = keyof typeof SortOptions;

// Next.js 15 페이지 params (Promise 타입)
export type UUIDParams = { params: Promise<{ uuid: string }> };
```

### 타입 위치

| 용도 | 위치 |
|------|------|
| 도메인 모델 (공유) | `type/*.type.ts` |
| 컴포넌트 Props | 컴포넌트 파일 내 인라인 |
| API 로컬 타입 | API 파일 내 인라인 |
| Route Handler 응답 | Route Handler에서 export |
