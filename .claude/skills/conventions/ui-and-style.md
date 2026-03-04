# 스타일링, 에러 처리, 캐시, 인증

> SKILL.md의 지원 파일입니다. 섹션 9-12의 상세 내용을 담고 있습니다.

---

## 9. 스타일링 (Tailwind CSS)

### twMerge 사용

```tsx
// 변형(variant) 매핑
const BUTTON_SIZE = {
  xxs: 'h-6 rounded-[1.125rem] px-5 whitespace-nowrap',
  xs:  'h-9 rounded-[1.125rem] px-3',
  s:   'h-11 rounded-[1.375rem] px-4',
  m:   'h-14 rounded-[1.75rem] px-4',
};
const BUTTON_STYLE: Record<ButtonStyle, string> = {
  primary:
    'bg-primary-primary text-white disabled:bg-grayscale-100 disabled:text-grayscale-400 active:bg-grayscale-100',
  secondary:
    'bg-white text-primary-primary border-primary-primary border-solid border disabled:bg-grayscale-50 disabled:text-grayscale-400 disabled:border-grayscale-100 disabled:border-solid disabled:border active:bg-grayscale-100',
  tertiary:
    'bg-white text-grayscale-lightText border-grayscale-border border-solid border disabled:bg-grayscale-50 disabled:text-grayscale-400 disabled:border-grayscale-100 disabled:border-grayscale-border disabled:border-solid disabled:border active:bg-grayscale-100',
  text:
    'bg-white text-primary-primary shadow-md disabled:bg-grayscale-100 disabled:text-grayscale-400 disabled:shadow-md active:bg-grayscale-100',
};

<button className={twMerge('font-bm text-sm', BUTTON_SIZE[size], BUTTON_STYLE[style])}>

// className prop 오버라이드
<input className={twMerge('h-11 rounded-xl border bg-white px-4', className)} />

// 조건부 스타일
<div className={twMerge('flex w-full', invalid ? 'border-error-error' : '')} />
```

### 색상 체계

```ts
// constants/colors.ts → tailwind.config.ts에 주입
primary:   { 50~900, primary, container, onContainer }
grayscale: { 50~900, container, border, lightText, text }
error:     { error, container }

// 사용 예: bg-primary-primary, text-grayscale-text, border-error-error
```

### 반응형 (Desktop-first)

```tsx
<div className="p-8 gap-6 max-md:p-4 max-md:gap-2">
<div className="flex max-[768px]:hidden">       {/* 모바일 숨김 */}
<div className="hidden max-md:flex">             {/* 모바일만 표시 */}
```

### 폰트

```
font-bm          → BMHANNAPro (헤더, 버튼 강조)
font-pretendard  → Pretendard (본문)
```

---

## 10. 에러 처리

### 3계층 구조

```
HTTP 레이어 (http/client, http/server)
  → response.ok 확인 → Error throw

커스텀 훅 (useFetch, useMutation)
  → try/catch → errorMessage 상태 저장

Route Handler (app/api/*)
  → try/catch → { code: 'ERROR', message } 응답
```

### 페이지 레벨

error.tsx와 not-found.tsx는 동일한 UI 패턴을 공유합니다.

```tsx
// app/wiki/error.tsx (not-found.tsx도 동일 구조)
'use client';

import Button from '@components/common/Button';
import DocumentTitle from '@components/document/layout/DocumentTitle';
import {route} from '@constants/route';
import {useParams, useRouter} from 'next/navigation';

const Error = () => {
  const {uuid} = useParams();
  const router = useRouter();

  const goPostPage = () => {
    router.push(route.goWikiWrite());
  };

  return (
    <div className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:p-4">
      <header className="flex w-full justify-between max-[768px]:gap-4">
        <DocumentTitle title={uuid as string} />
        <fieldset className="flex gap-2">
          <Button style="primary" size="xs" onClick={goPostPage}>
            작성하기
          </Button>
        </fieldset>
      </header>
      <h1 className="font-bm text-2xl text-grayscale-800">존재하지 않는 문서에요.</h1>
    </div>
  );
};

export default Error;
```

```tsx
// app/global-error.tsx: 전역 에러 (Sentry 연동, html/body 직접 렌더)
'use client';
useEffect(() => { Sentry.captureException(error); }, [error]);
```

---

## 11. 캐시 전략 (ISR)

```ts
// constants/cache.ts
import {recentlyParams} from './params';

export const TAG_PREFIX = 'wiki/';

export const CACHE = {
  time: {
    basicRevalidate: 43200,   // 12시간
    longRevalidate: 604800,   // 7일
  },
  tag: {
    // 정적 태그
    getRecentlyDocuments: TAG_PREFIX + generatePaginationCacheTags(recentlyParams, 'documents'),
    getDocumentsUUID: TAG_PREFIX + 'get-documents-uuid',
    // 동적 태그 (함수)
    getDocuments: (params: PaginationParams) => TAG_PREFIX + generatePaginationCacheTags(params, 'documents'),
    getDocumentByUUID: (uuid: string) => TAG_PREFIX + `title:${uuid}`,
    getDocumentByTitle: (title: string) => TAG_PREFIX + `title:${decodeURI(title)}`,
    getDocumentLogsByUUID: (uuid: string) => TAG_PREFIX + `logs:${uuid}`,
    getSpecificDocumentLog: (logId: number) => TAG_PREFIX + `specificLog:${logId}`,
  },
} as const;
```

| 상황 | 방식 | 캐시 |
|------|------|------|
| 문서 뷰어 (서버) | ISR + `generateStaticParams` | 12시간 revalidate |
| 문서 편집 (클라이언트) | `useFetch` | 없음 (항상 최신) |
| 쓰기 후 | Route Handler | `revalidateTag`로 즉시 무효화 |

---

## 12. 인증

| 영역 | 인증 | 처리 |
|------|------|------|
| `/wiki/*` | 없음 | 전체 공개 |
| `/admin/*` | 쿠키 `token` | `middleware.ts`에서 가드 |
| `/admin/login` | 없음 | 토큰 있으면 대시보드로 리다이렉트 |

```
로그인 플로우:
POST /api/post-admin-login → 백엔드 /auth/login
→ Set-Cookie에서 토큰 추출 → HttpOnly 쿠키 설정
→ 이후 middleware가 /admin/* 요청마다 검사
```

서버 → 백엔드 쿠키 포워딩:

```ts
const cookieStore = await cookies();
const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
await deleteDocument(uuid, cookieHeader);
```
