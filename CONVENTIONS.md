
# Crew Wiki Next - 개발 컨벤션 가이드

> 이 프로젝트에 새로 합류하는 팀원의 온보딩과 AI 기반 개발 요청 시 참고 문서입니다.

---

## 0. 이 문서에 대하여

### 프로젝트 소개

Crew Wiki Next는 **팀 내부 위키 시스템**입니다. 팀원 누구나 문서를 작성하고, 검색하고, 편집할 수 있습니다.

주요 기능:

| 기능 | 설명 | 주요 URL |
|------|------|----------|
| 문서 조회 | 마크다운으로 작성된 위키 문서 열람 | `/wiki/{uuid}` |
| 문서 작성 | Toast UI Editor로 마크다운 문서 생성 | `/wiki/post` |
| 문서 편집 | 기존 문서 수정 (버전 충돌 감지) | `/wiki/{uuid}/edit` |
| 버전 이력 | 문서의 변경 이력 조회 및 특정 버전 확인 | `/wiki/{uuid}/logs` |
| 검색 | Trie 자료구조 기반 실시간 자동완성 검색 | 헤더 검색바 |
| 인기 문서 | 조회수/편집수 기준 정렬 | `/wiki/popular` |
| 통계 | 문서 통계 시각화 | `/wiki/statistics` |
| 그룹 | 조직별 문서 관리 및 이벤트 | `/wiki/groups/{uuid}` |
| 어드민 | 관리자 로그인, 문서 관리, 대시보드 | `/admin/*` |

### 이 문서의 작성 원칙

이 문서는 다음 지침을 기반으로 작성되었습니다. 문서를 갱신할 때도 이 원칙을 지켜주세요.

1. **초보자 우선**: 이 프로젝트를 처음 보는 사람이 이해할 수 있어야 합니다
2. **탐색 가이드 포함**: 기능 구현 시 페이지와 코드를 어떻게 찾아가는지 구체적으로 안내합니다
3. **API 접근법 설명**: API를 활용할 때 어떻게 알아가야 하는지 단계별로 세세하게 설명합니다
4. **코드 예시 필수**: 모든 패턴에 실제 프로젝트 코드 기반의 예시를 포함합니다
5. **AI 요청 호환**: 이 문서를 참고하여 AI에게 개발을 요청하거나, 직접 보고 개발할 수 있어야 합니다

### 이 문서 읽는 법

**처음 프로젝트에 합류했다면** (순서대로):
```
이 파일     → 프로젝트가 뭔지 파악, 디렉토리 구조, 기술 스택
architecture.md 섹션 2  → URL에서 코드 찾아가는 법 + 실전 워크스루
아래 섹션 17 → 로컬 개발 환경 실행
```

**새 기능을 구현해야 한다면**:
```
아래 섹션 13 → 읽기/쓰기/조회 체크리스트로 전체 흐름 파악
api-and-data.md 섹션 5  → API 아키텍처 + 새 API 연동 가이드
architecture.md 섹션 3  → 페이지 작성 패턴
api-and-data.md 섹션 6  → 커스텀 훅 패턴
```

**컴포넌트를 만들거나 수정해야 한다면**:
```
architecture.md 섹션 4  → 컴포넌트 컨벤션, Props 타입, Storybook
ui-and-style.md 섹션 9  → Tailwind 스타일링 규칙
api-and-data.md 섹션 7  → 상태관리 패턴 (Zustand)
```

**특정 기능을 깊게 이해하고 싶다면**:
```
advanced-patterns.md 섹션 14 → Toast UI Editor (에디터)
advanced-patterns.md 섹션 15 → Amplitude (분석)
advanced-patterns.md 섹션 16 → Trie (검색 자동완성)
```

---

## 1. 프로젝트 구조

```
client/src/
├── app/                     # Next.js App Router (페이지 + API Routes)
│   ├── wiki/                #   위키 페이지
│   ├── admin/               #   어드민 페이지
│   └── api/                 #   Route Handlers (BFF 역할)
├── apis/                    # API 호출 함수
│   ├── server/              #   서버 전용 ('use server')
│   └── client/              #   클라이언트 전용 ('use client')
├── http/                    # fetch 래퍼 (axios 미사용)
│   ├── server/              #   서버용 (cache, revalidate 지원)
│   └── client/              #   클라이언트용 (credentials: include)
├── components/              # UI 컴포넌트
│   ├── common/              #   공통 (Button, Modal, Input ...)
│   ├── document/            #   문서 관련
│   ├── layout/              #   레이아웃 (Header, Sidebar ...)
│   ├── admin/               #   어드민 전용
│   └── group/               #   그룹 관련
├── hooks/                   # 커스텀 훅
│   ├── fetch/               #   조회 훅 (useGet*, useSearch*)
│   └── mutation/            #   변경 훅 (usePost*, usePut*, useUpload*)
├── store/                   # Zustand 전역 상태
├── constants/               # 상수
│   ├── endpoint.ts          #   백엔드 API 엔드포인트
│   ├── urls.ts              #   프론트 URL 상수
│   ├── route.ts             #   페이지 이동 함수
│   ├── cache.ts             #   ISR 캐시 태그/시간
│   └── colors.ts            #   Tailwind 커스텀 색상
├── type/                    # TypeScript 타입 정의
└── utils/                   # 유틸리티 함수
```

### 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) + React 19 |
| 상태관리 | Zustand 5 |
| 스타일링 | Tailwind CSS 3 + tailwind-merge |
| HTTP | 순수 fetch 래핑 (axios 미사용) |
| 에디터 | Toast UI React Editor |
| 모니터링 | Sentry |
| 분석 | Amplitude |
| 문서화 | Storybook (`*.stories.tsx`) |

### import 경로 alias

상대경로(`../`) 대신 항상 alias를 사용합니다. 동일 디렉토리 내 파일만 `./` 허용.

```ts
import { ENDPOINT }           from '@constants/endpoint';
import { requestGetServer }   from '@http/server';
import { WikiDocument }       from '@type/Document.type';
import { postDocumentServer } from '@apis/server/document';
import Button                 from '@components/common/Button';
```

| Alias | 경로 |
|-------|------|
| `@apis/*` | `src/apis/*` |
| `@app/*` | `src/app/*` |
| `@components/*` | `src/components/*` |
| `@constants/*` | `src/constants/*` |
| `@store/*` | `src/store/*` |
| `@hooks/*` | `src/hooks/*` |
| `@http/*` | `src/http/*` |
| `@type/*` | `src/type/*` |
| `@utils/*` | `src/utils/*` |

---

## 지원 파일 안내

이 스킬은 주제별 상세 가이드를 별도 파일로 분리합니다. 필요한 섹션의 파일을 참조하세요.

### architecture.md — 페이지 구조와 컴포넌트

| 섹션 | 내용 |
|------|------|
| 2. 페이지 찾기 | URL → 파일 매핑, 파일 추적 순서, 레이아웃 중첩, **"문서 조회" 실전 워크스루** |
| 3. 페이지 작성 패턴 | 서버/클라이언트 컴포넌트 페이지, layout.tsx 패턴 |
| 4. 컴포넌트 컨벤션 | 선언/export, 네이밍, Storybook, 'use client' 기준, Props 타입, 내부 구조 순서 |

### api-and-data.md — API, 훅, 상태관리

| 섹션 | 내용 |
|------|------|
| 5. API 요청 아키텍처 | 데이터 흐름 전체도, **처음 API 파악하는 방법**, Client/Server API, Route Handler(BFF), Presigned URL, 엔드포인트 상수 |
| 6. 커스텀 훅 | useFetch, useMutation, 조회/뮤테이션 훅 패턴, 훅 네이밍 |
| 7. 상태관리 (Zustand) | 스토어 작성, 셀렉터, get(), 초기화/cleanup 패턴 |
| 8. 타입 정의 | 파일 네이밍, 선언 규칙 (interface vs type), 타입 위치 |

### ui-and-style.md — 스타일링, 에러 처리, 캐시, 인증

| 섹션 | 내용 |
|------|------|
| 9. 스타일링 (Tailwind CSS) | twMerge, 색상 체계, 반응형 (Desktop-first), 폰트 |
| 10. 에러 처리 | 3계층 구조, 페이지 레벨 (error.tsx, not-found.tsx, global-error.tsx) |
| 11. 캐시 전략 (ISR) | cache.ts 상수, 읽기/쓰기/무효화 캐시 전략 |
| 12. 인증 | 위키(공개)/어드민(쿠키) 분리, 로그인 플로우, 쿠키 포워딩 |

### advanced-patterns.md — 에디터, 분석, 검색

| 섹션 | 내용 |
|------|------|
| 14. Toast UI Editor | dynamic import, 에디터 컴포넌트 전체 코드, 마크다운→HTML 파이프라인 |
| 15. Amplitude 이벤트 트래킹 | 초기화, useAmplitude 훅, 이벤트 목록, 뮤테이션 훅 연동 |
| 16. Trie 검색 자동완성 | Trie 자료구조, Zustand 스토어, InitTrie 초기화, 검색 흐름 |

---

## 13. 신규 기능 개발 체크리스트

### 읽기 기능 (서버 컴포넌트)

```
1. type/         → 도메인 타입 정의
2. constants/    → endpoint.ts + cache.ts에 추가
3. apis/server/  → Server API 함수 (캐시 설정 포함)
4. app/          → page.tsx에서 호출 + 렌더링
5. components/   → UI 컴포넌트 작성
```

### 쓰기 기능 (클라이언트 → BFF)

```
1. type/            → Request/Response 타입
2. constants/       → endpoint.ts에 추가
3. apis/server/     → Server API 함수
4. app/api/         → Route Handler (revalidateTag 포함)
5. apis/client/     → Client API 함수 (BFF 호출)
6. hooks/mutation/  → 뮤테이션 훅 (useMutation 래핑)
7. components/      → UI에서 훅 사용
```

### 조회 기능 (클라이언트)

```
1. type/           → 응답 타입
2. constants/      → endpoint.ts에 추가
3. apis/client/    → Client API 함수
4. hooks/fetch/    → 조회 훅 (useFetch 래핑)
5. components/     → UI에서 훅 사용
```

---

## 17. 로컬 개발 명령어

이 프로젝트는 **yarn**을 사용합니다 (npm 아님).

```bash
# 프로젝트 루트가 아닌 client/ 디렉토리에서 실행
cd client

# 의존성 설치
yarn install

# 개발 서버 (Turbopack 활성화)
yarn dev                  # next dev --turbopack

# 프로덕션 빌드
yarn build                # next build
yarn build:release        # 버전 정보 포함 빌드 (cross-env NEXT_PUBLIC_APP_VERSION)
yarn start                # next start (빌드 후 실행)

# 코드 품질
yarn lint                 # eslint "src/**/*.{js,jsx,ts,tsx}"
yarn lint:fix             # eslint --fix
yarn prettier:write       # prettier --write
yarn prettier:check       # prettier --check

# Storybook
yarn storybook            # storybook dev -p 6006
yarn build-storybook      # storybook build

# 릴리즈 준비
yarn prepare:release      # node scripts/prepare-release.mjs
```

### lint-staged (커밋 시 자동)

```json
{
  "*.{ts,tsx}": ["prettier --write", "eslint"]
}
```

> Husky + lint-staged가 설정되어 있어, `git commit` 시 변경된 `.ts`, `.tsx` 파일에 대해 자동으로 prettier → eslint가 실행됩니다.

---

# 페이지 구조와 컴포넌트

> SKILL.md의 지원 파일입니다. 섹션 2-4의 상세 내용을 담고 있습니다.

---

## 2. 페이지 찾기 - URL에서 코드까지

### URL → 파일 매핑

| URL | 파일 경로 |
|-----|----------|
| `/` | `next.config.ts`에서 `/wiki/{대문uuid}`로 리다이렉트 |
| `/wiki/{uuid}` | `app/wiki/[uuid]/page.tsx` |
| `/wiki/{uuid}/edit` | `app/wiki/[uuid]/edit/page.tsx` |
| `/wiki/{uuid}/logs` | `app/wiki/[uuid]/logs/page.tsx` |
| `/wiki/{uuid}/log/{logId}` | `app/wiki/[uuid]/log/[logId]/page.tsx` |
| `/wiki/popular` | `app/wiki/popular/page.tsx` |
| `/wiki/statistics` | `app/wiki/statistics/page.tsx` |
| `/wiki/post` | `app/wiki/post/page.tsx` |
| `/wiki/groups/{uuid}` | `app/wiki/groups/[uuid]/page.tsx` |
| `/admin/login` | `app/admin/(auth)/login/page.tsx` |
| `/admin/dashboard` | `app/admin/(admin)/dashboard/page.tsx` |
| `/admin/documents` | `app/admin/(admin)/documents/page.tsx` |

### 기능 수정 시 파일 추적 순서

어떤 URL의 기능을 수정하고 싶을 때, 아래 순서로 파일을 찾아갑니다.

```
1단계: page.tsx 찾기 (URL → 파일 매핑표 참고)
  예: /wiki/{uuid}/logs → app/wiki/[uuid]/logs/page.tsx

2단계: 레이아웃 확인 (공통 UI가 레이아웃에 있을 수 있음)
  → app/wiki/[uuid]/logs/layout.tsx   (LogsHeader, 제목)
  → app/wiki/[uuid]/layout.tsx        (FloatingButton)
  → app/wiki/layout.tsx               (WikiHeader, 사이드바)
  → app/layout.tsx                    (폰트, modal-root)

3단계: 컴포넌트 추적 (page.tsx의 import를 따라감)
  → @components/document/layout/DocumentHeader
  → @components/common/Button

4단계: 데이터 흐름 추적
  서버: @apis/server/*.ts → @http/server/
  클라이언트: @hooks/fetch/*.ts → @apis/client/*.ts → @http/client/

5단계: 상수 확인
  → @constants/endpoint.ts  (API 경로)
  → @constants/cache.ts     (캐시 태그)
  → @constants/route.ts     (페이지 이동 함수)
```

### 레이아웃 중첩 구조

```
app/layout.tsx                       → 폰트, html/body, modal-root
  └─ app/wiki/layout.tsx             → WikiHeader, InitTrie, RecentlyEdit 사이드바
      └─ app/wiki/[uuid]/layout.tsx  → FloatingButton
          └─ page.tsx                → 실제 페이지 컨텐츠
```

### 실전 워크스루: "문서 조회" 기능을 처음부터 끝까지 따라가기

`/wiki/{uuid}` 페이지가 어떻게 동작하는지, 실제 파일을 하나씩 따라가 봅니다.

**Step 1. 레이아웃이 먼저 감싼다**

URL에 접근하면 Next.js가 레이아웃을 바깥부터 안쪽으로 중첩 렌더링합니다.

```
app/layout.tsx                    → <html>, <body>, 폰트 설정, modal-root
  └─ app/wiki/layout.tsx          → AmplitudeInitializer, WikiHeader, InitTrie, RecentlyEdit 사이드바
      └─ app/wiki/[uuid]/layout.tsx → FloatingButton (글쓰기 버튼)
          └─ app/wiki/[uuid]/page.tsx  ← 여기가 실제 페이지
```

> `wiki/layout.tsx`에서 `<InitTrie />`가 전체 문서 목록을 불러와 Trie를 구축하고, `<AmplitudeInitializer />`가 분석 도구를 초기화합니다. 이 두 컴포넌트는 UI를 렌더링하지 않고 `return null`로 초기화만 수행합니다.

**Step 2. page.tsx가 서버에서 데이터를 가져온다**

```
📄 app/wiki/[uuid]/page.tsx (서버 컴포넌트)
│
├── const {uuid} = await params;           // Next.js 15: params는 Promise
├── getDocumentByUUIDServer(uuid)          // 서버 API 호출
│   │
│   └── 📄 apis/server/document.ts
│       └── requestGetServer({
│             endpoint: ENDPOINT.getDocumentByUUID(uuid),   // → /document/uuid/{uuid}
│             next: { revalidate: 43200,                    // 12시간 ISR 캐시
│                     tags: [CACHE.tag.getDocumentByUUID(uuid)] }
│           })
│           │
│           └── 📄 http/server/ (fetch 래퍼)
│               └── fetch(백엔드URL + '/document/uuid/{uuid}')  // 실제 HTTP 요청
│
├── markdownToHtml(document.contents)      // 마크다운 → HTML 변환
│   └── 📄 utils/markdownToHtml.ts
│       └── unified → remarkParse → remarkGfm → rehypeSanitize → HTML 문자열
│
└── return JSX                             // 서버에서 HTML로 렌더링
    ├── <MobileDocumentHeader />
    ├── <DocumentHeader title={...} uuid={...} />
    ├── <DocumentContents contents={htmlString} />
    ├── <DocumentFooter generateTime={...} />
    └── <IncrementViewCountByUUID uuid={...} />   // 조회수 증가 (클라이언트)
```

**Step 3. 상수 파일들이 연결고리 역할을 한다**

위 흐름에서 등장한 상수들의 실제 위치:

```ts
// constants/endpoint.ts — 백엔드 API 경로
ENDPOINT.getDocumentByUUID(uuid)  // → '/document/uuid/{uuid}'

// constants/cache.ts — ISR 캐시 태그
CACHE.tag.getDocumentByUUID(uuid) // → 'wiki/title:{uuid}'
CACHE.time.basicRevalidate        // → 43200 (12시간)

// constants/route.ts — 프론트 페이지 이동 함수
route.goWiki(uuid)                // → '/wiki/{uuid}'
route.goWikiEdit(uuid)            // → '/wiki/{uuid}/edit'
```

**Step 4. 문서가 수정되면 캐시가 무효화된다**

사용자가 문서를 편집하면, 쓰기 흐름이 캐시를 갱신합니다:

```
[편집 페이지] Edit 버튼 클릭
  → usePutDocument().putDocument(data)
    → putDocumentClient(data)            // Client API
      → fetch('/api/put-document')       // Route Handler(BFF) 호출
        → putDocumentServer(data)        // 백엔드에 PUT
        → revalidateTag('wiki/title:{uuid}')   // ← 이 캐시가 무효화됨
        → revalidateTag('wiki/logs:{uuid}')
  → router.push(route.goWiki(uuid))     // 문서 조회 페이지로 이동
  → router.refresh()                    // 서버 컴포넌트 다시 렌더 → 최신 데이터
```

> 이것이 "읽기는 서버 컴포넌트에서 직접, 쓰기는 BFF(Route Handler)를 경유"하는 이유입니다. `revalidateTag()`는 서버에서만 호출할 수 있기 때문입니다.

---

## 3. 페이지 작성 패턴

### 서버 컴포넌트 페이지

`'use client'` 없이 async 함수로 선언합니다. 서버에서 직접 데이터를 fetch합니다.

```tsx
// app/wiki/[uuid]/page.tsx
import {getDocumentByUUIDServer, getAllDocumentsServer} from '@apis/server/document';
import DocumentContents from '@components/document/layout/DocumentContents';
import DocumentFooter from '@components/document/layout/DocumentFooter';
import DocumentHeader from '@components/document/layout/DocumentHeader';
import MobileDocumentHeader from '@components/document/layout/MobileDocumentHeader';
import type {UUIDParams} from '@type/PageParams.type';
import {generateDocumentPageMetadata} from '@utils/generateDocumentMetadata';
import markdownToHtml from '@utils/markdownToHtml';
import {notFound} from 'next/navigation';
import {IncrementViewCountByUUID} from './IncrementViewCountByUUID';

// ISR 정적 생성
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const documents = await getAllDocumentsServer();
    if (!documents || !Array.isArray(documents)) return [];
    return documents.map(({uuid}) => ({uuid}));
  } catch (error) {
    console.error('generateStaticParams 에러', error);
    return [];
  }
}

// SEO 메타데이터 (유틸 함수로 위임)
export async function generateMetadata({params}: UUIDParams) {
  const {uuid} = await params;
  return await generateDocumentPageMetadata(uuid);
}

// 페이지 본체 (Next.js 15: params를 await 필수)
const DocumentPage = async ({params}: UUIDParams) => {
  const {uuid} = await params;
  const document = await getDocumentByUUIDServer(uuid);

  if (!document) notFound();

  const contents = await markdownToHtml(document.contents);

  return (
    <div className="flex w-full flex-col gap-6 max-[768px]:gap-2">
      <MobileDocumentHeader uuid={document.documentUUID} />
      <section className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:gap-2 max-md:p-4">
        <DocumentHeader title={document.title} uuid={document.documentUUID} />
        <DocumentContents contents={contents} />
      </section>
      <DocumentFooter generateTime={document.generateTime} />
      <IncrementViewCountByUUID uuid={document.documentUUID} />
    </div>
  );
};

export default DocumentPage;
```

### 클라이언트 컴포넌트 페이지

사용자 인터랙션이 필요한 페이지에 사용합니다.

```tsx
// app/wiki/[uuid]/edit/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useGetLatestDocumentByUUID } from '@hooks/fetch/useGetLatestDocumentByUUID';
import { useDocument } from '@store/document';

const EditPage = ({ document }: EditPageProps) => {
  const setInit = useDocument(action => action.setInit);
  const reset = useDocument(action => action.reset);

  useEffect(() => {
    setInit(document);
    return () => reset();              // 언마운트 시 cleanup 필수
  }, [document, setInit, reset]);

  return <div>...</div>;
};

const Page = () => {
  const { uuid } = useParams();        // 클라이언트에서는 useParams
  const { document } = useGetLatestDocumentByUUID(uuid as string);

  return document && <EditPage document={document} />;
};

export default Page;
```

### layout.tsx 패턴

```tsx
// 패턴 A: 공통 UI 감싸기
const Layout = ({ children }: React.PropsWithChildren) => (
  <div className="flex">
    <Header />
    <main>{children}</main>
    <Sidebar />
  </div>
);
export default Layout;

// 패턴 B: 메타데이터만 (투명 레이아웃)
export const metadata = { title: '새 문서 작성' };

const Layout = ({ children }: React.PropsWithChildren) => children;
export default Layout;

// 패턴 C: 서버 데이터 fetch
const Layout = async ({ children, params }: Props) => {
  const { uuid } = await params;
  const document = await getDocumentByUUIDServer(uuid);

  return document && (
    <section>
      <LogsHeader uuid={document.documentUUID} />
      {children}
    </section>
  );
};
export default Layout;
```

---

## 4. 컴포넌트 컨벤션

### 선언 및 export

```tsx
// 기본: const 화살표 함수 + 하단 export default
const Button = ({ size, style, children }: ButtonProps) => {
  return <button>{children}</button>;
};

export default Button;

// Modal 계열: named export
export const Modal = ({ children, className }: ModalProps) => {
  return <div>{children}</div>;
};
```

### 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 폴더 | PascalCase | `Button/`, `CustomCalendar/` |
| 메인 컴포넌트 파일 | `index.tsx` | `Button/index.tsx` |
| 서브 컴포넌트 파일 | PascalCase.tsx | `CalendarGrid.tsx` |
| 훅 파일 | camelCase.ts | `useModal.tsx` |

```
common/Button/
  index.tsx              ← import Button from '@components/common/Button'

common/Modal/
  Modal.tsx              ← import { Modal } from '.../Modal/Modal'
  Backdrop.tsx
  ModalPortal.tsx
  useModal.tsx
```

> barrel export 미사용. `index.tsx` = 컴포넌트 본체.

### Storybook

공통 컴포넌트에 `*.stories.tsx` 파일을 함께 작성합니다.

```
common/Button/
  index.tsx
  Button.stories.tsx     ← 같은 폴더에 위치

common/Modal/
  Modal.tsx
  Modal.stories.tsx
```

```tsx
// Button.stories.tsx
import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import Button from '@components/common/Button';

const meta: Meta<typeof Button> = {
  title: 'Common/Button',       // Storybook 사이드바 경로
  component: Button,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { style: 'primary', size: 'm', children: '버튼' },
};

export const Secondary: Story = {
  args: { style: 'secondary', size: 'm', children: '버튼' },
};

// decorators로 배경색 등 감싸기
export const Text: Story = {
  args: { style: 'text', size: 'm', children: '버튼' },
  decorators: [
    Story => (
      <div style={{backgroundColor: '#f3f4f6', padding: '2rem'}}>
        <Story />
      </div>
    ),
  ],
};
```

### 'use client' 기준

| 조건 | 지시어 |
|------|--------|
| React 훅 사용 (`useState`, `useEffect` 등) | `'use client'` 필수 |
| 이벤트 핸들러 (`onClick`, `onChange` 등) | `'use client'` 필수 |
| Next.js 클라이언트 훅 (`useRouter`, `useParams`) | `'use client'` 필수 |
| async 서버 fetch 또는 순수 UI 렌더링 | 지시어 없음 (Server Component) |

### Props 타입

```tsx
// 기본: interface (같은 파일 내 인라인)
interface CardProps {
  document: PopularDocument;
  rank: number;
}

// PropsWithChildren 합성: type
type ModalProps = PropsWithChildren<{
  className?: string;
}>;

// ComponentProps 확장: type
type ChipProps = ComponentProps<'button'> & {
  text: string;
};
```

> 네이밍: `[ComponentName]Props`. 별도 파일 분리 없이 같은 파일에 정의.

### 컴포넌트 내부 구조 순서

```tsx
'use client';

// 1. import
// 2. 타입/인터페이스
interface Props { ... }
// 3. 외부 상수 (필요 시)
const VARIANT_MAP = { ... };

const MyComponent = ({ ...props }: Props) => {
  // 4. useState
  // 5. useRef
  // 6. 커스텀 훅
  // 7. useEffect
  // 8. 이벤트 핸들러 (handle* = 내부, on* = props 콜백)
  // 9. return
};

export default MyComponent;
```

---

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

---

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

---

# 에디터, 분석, 검색 패턴

> SKILL.md의 지원 파일입니다. 섹션 14-16의 상세 내용을 담고 있습니다.

---

## 14. Toast UI Editor 사용 패턴

### 에디터 컴포넌트 구조

Toast UI React Editor를 **dynamic import**로 로드합니다 (SSR 불가).

```tsx
// components/document/TuiEditor/index.tsx
'use client';

import '@toast-ui/editor/toastui-editor.css';
import dynamic from 'next/dynamic';
import {useCallback, useEffect, useRef} from 'react';
import {EditorType, HookCallback} from '@type/Editor.type';
import {useDocument} from '@store/document';
import {useUploadImage} from '@hooks/mutation/useUploadImage';
import useThrottle from '@hooks/useThrottle';

// SSR 비활성화 필수
const DynamicLoadEditor = dynamic(
  () => import('@toast-ui/react-editor').then(mod => mod.Editor),
  {ssr: false},
);

const toolbar = [
  ['heading', 'bold', 'italic', 'strike'],
  ['hr', 'quote', 'ul', 'ol'],
  ['image', 'link'],
  ['scrollSync'],
];

function TuiEditor({initialValue, saveMarkdown, onChange}: TuiEditorProps) {
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
  const editorRef = useRef<EditorType | null>(null);
  const uuid = useDocument(state => state.uuid);
  const {uploadImageAndReplaceUrl} = useUploadImage(uuid);
  const isInitializedRef = useRef(false);

  // 초기값 수동 설정 (ref 기반)
  useEffect(() => {
    if (!editorRef.current || isInitializedRef.current) return;
    editorRef.current.getInstance().setMarkdown(initialValue);
    isInitializedRef.current = true;
  }, [editorRef, initialValue]);

  // 이미지 업로드 핸들러 (addImageBlobHook)
  const imageHandler = async (blob: File | Blob, callback: HookCallback) => {
    if (!(blob instanceof File)) {
      uploadImageAndReplaceUrl({file: new File([blob], 'blob'), callback});
    } else {
      uploadImageAndReplaceUrl({file: blob, callback});
    }
  };

  // 변경 감지 + 자동저장 스로틀 (5초)
  const {makeThrottle, cleanup} = useThrottle();
  const MARKDOWN_THROTTLE_TIME = 5000;

  // 관련 검색어 (에디터 내 [[문서제목]] 패턴 감지)
  const {top, left, titles, onClick, recordRefStartPos, recordRefEndPose, showRelativeSearchTerms} =
    useRelativeSearchTerms({editorRef});

  const handleChange = useCallback(() => {
    if (!editorRef.current) return;
    const markdown = editorRef.current.getInstance().getMarkdown();
    onChange(markdown);
    if (saveMarkdown) {
      makeThrottle(() => saveMarkdown(markdown), MARKDOWN_THROTTLE_TIME)();
    }
    recordRefStartPos();
    recordRefEndPose();
  }, [editorRef, makeThrottle, onChange, recordRefEndPose, recordRefStartPos, saveMarkdown]);

  useEffect(() => {
    return cleanup;     // 스로틀 타이머 정리
  }, [cleanup]);

  return (
    <div onClick={onClick}>
      <DynamicLoadEditor
        ref={editorRef}
        initialValue={initialValue}
        onChange={handleChange}
        initialEditType="markdown"
        autofocus={false}
        previewStyle={isDesktop ? 'vertical' : 'tab'}
        toolbarItems={toolbar}
        hideModeSwitch={true}
        height="500px"
        hooks={{addImageBlobHook: imageHandler}}
      />
      {/* 에디터 내에서 감지된 관련 문서 검색어 드롭다운 */}
      <RelativeSearchTerms
        show={showRelativeSearchTerms}
        style={{top: `${top + 200}px`, left, width: 320}}
        searchTerms={titles ?? []}
      />
    </div>
  );
}
```

**핵심 포인트**:
- `dynamic(() => ..., {ssr: false})`: Toast UI는 DOM API에 의존하므로 SSR 비활성화 필수
- `editorRef.current.getInstance()`: 에디터 인스턴스에 직접 접근하여 `getMarkdown()`, `setMarkdown()` 호출
- `hooks.addImageBlobHook`: 이미지 붙여넣기/업로드 시 Presigned URL 패턴으로 S3 업로드 후 CDN URL 반환
- `useThrottle`: 자동저장을 5초 간격으로 스로틀링

### 마크다운 → HTML 파이프라인

서버 컴포넌트에서 마크다운을 HTML로 변환할 때 사용합니다.

```ts
// utils/markdownToHtml.ts
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import remarkParse from 'remark-parse';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import {unified} from 'unified';

export default async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)          // 마크다운 파싱
    .use(remarkBreaks)         // 줄바꿈 → <br>
    .use(remarkGfm)            // GFM (테이블, 체크리스트 등)
    .use(remarkRehype, {allowDangerousHtml: true})  // remark → rehype
    .use(rehypeRaw)            // HTML 태그 유지
    .use(rehypeSanitize)       // XSS 방지
    .use(rehypeStringify, {allowDangerousHtml: true})
    .process(markdown);

  return result.toString();
}
```

**사용 위치**: 서버 컴포넌트의 `page.tsx`에서 `const contents = await markdownToHtml(document.contents)` 형태로 호출.

---

## 15. Amplitude 이벤트 트래킹

### 초기화

`wiki/layout.tsx`에서 `<AmplitudeInitializer />`를 렌더링하여 앱 진입 시 자동 초기화합니다.

```tsx
// components/common/AmplitudeInitializer/index.tsx
'use client';

import {useEffect} from 'react';
import {init} from '@amplitude/analytics-browser';

export const AmplitudeInitializer = () => {
  useEffect(() => {
    init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, {
      autocapture: {
        elementInteractions: false,
        fileDownloads: false,
        sessions: false,
        formInteractions: false,
      },
    });
  }, []);

  return null;
};
```

```tsx
// app/wiki/layout.tsx
import {AmplitudeInitializer} from '@components/common/AmplitudeInitializer';

const Layout = ({children}: React.PropsWithChildren) => (
  <div className="App relative">
    <AmplitudeInitializer />
    <WikiHeader />
    <InitTrie />
    ...
  </div>
);
```

### useAmplitude 훅

```ts
// hooks/useAmplitude.ts
'use client';

import {track} from '@amplitude/analytics-browser';
import {useCallback} from 'react';

const useAmplitude = () => {
  const trackEvent = useCallback((eventName: string, eventProps: Record<string, unknown> = {}) => {
    track({
      event_type: eventName,
      event_properties: {domain: process.env.NODE_ENV, ...eventProps},
    });
  }, []);

  const trackDocumentCreate = useCallback(
    (title: string, documentUUID: string) => trackEvent('문서 작성', {title, documentUUID}),
    [trackEvent],
  );

  const trackDocumentUpdate = useCallback(
    (title: string, documentUUID: string) => trackEvent('문서 수정', {title, documentUUID}),
    [trackEvent],
  );

  const trackDocumentSearch = useCallback(
    (title: string, documentUUID: string) => trackEvent('문서 검색', {title, documentUUID}),
    [trackEvent],
  );

  return {trackDocumentCreate, trackDocumentUpdate, trackDocumentSearch};
};

export default useAmplitude;
```

### 이벤트 목록

| 이벤트명 | 호출 위치 | 트리거 |
|----------|----------|--------|
| `문서 작성` | `usePostDocument` → `onSuccess` | 문서 생성 성공 시 |
| `문서 수정` | `usePutDocument` → `onSuccess` | 문서 수정 성공 시 |
| `문서 검색` | 검색 UI 컴포넌트 | 검색 결과 클릭 시 |

### 뮤테이션 훅에서 사용

```ts
// hooks/mutation/usePostDocument.ts
export const usePostDocument = () => {
  const {trackDocumentCreate} = useAmplitude();

  const {mutate, isPending} = useMutation<PostDocumentContent, WikiDocument>({
    mutationFn: postDocumentClient,
    onSuccess: document => {
      trackDocumentCreate(document.title, document.documentUUID);  // 이벤트 발송
      addTitle(document.title, document.documentUUID);
      router.push(route.goWiki(document.documentUUID));
      router.refresh();
    },
  });
  // ...
};

// hooks/mutation/usePutDocument.ts
export const usePutDocument = () => {
  const {trackDocumentUpdate} = useAmplitude();

  const {mutate, isPending} = useMutation<PostDocumentContent, WikiDocument>({
    mutationFn: putDocumentClient,
    onSuccess: document => {
      trackDocumentUpdate(document.title, document.documentUUID);  // 이벤트 발송
      updateTitle(document.title, document.title, document.documentUUID);
      router.push(route.goWiki(document.documentUUID));
      router.refresh();
    },
  });
  // ...
};
```

---

## 16. Trie 검색 자동완성

### 자료구조

문서 제목 검색을 위한 커스텀 Trie 클래스입니다.

```ts
// utils/trie.ts
import {TitleAndUUID} from '@apis/client/document';

class Node {
  child: Map<string, Node> = new Map();
  uuid?: string;
  title?: string;
  isEnd: boolean = false;
}

export class Trie {
  private root: Node;

  constructor(data: TitleAndUUID[] = []) {
    this.root = new Node();
    data.forEach(({title, uuid}) => this.add(title, uuid));
  }

  add(title: string, uuid: string): void {
    let currentNode = this.root;
    for (const char of title) {
      if (!currentNode.child.has(char)) currentNode.child.set(char, new Node());
      currentNode = currentNode.child.get(char)!;
    }
    currentNode.uuid = uuid;
    currentNode.title = title;
    currentNode.isEnd = true;
  }

  search(prefix: string): TitleAndUUID[] {
    let currentNode = this.root;
    for (const char of prefix) {
      const nextNode = currentNode.child.get(char);
      if (!nextNode) return [];
      currentNode = nextNode;
    }
    const results: TitleAndUUID[] = [];
    this.searchFunc(currentNode, prefix, results);
    return results;
  }

  delete(word: string, uuid: string): void {
    this.deleteFunc(this.root, word, uuid, 0);
  }

  private deleteFunc(node: Node, word: string, uuid: string, depth: number): boolean {
    if (depth === word.length) {
      if (!node.isEnd || node.uuid !== uuid) return false;
      node.isEnd = false;
      node.uuid = undefined;
      node.title = undefined;
      return node.child.size === 0;
    }
    const char = word[depth];
    const nextNode = node.child.get(char);
    if (!nextNode) return false;
    const shouldDeleteChild = this.deleteFunc(nextNode, word, uuid, depth + 1);
    if (shouldDeleteChild) node.child.delete(char);
    return node.child.size === 0 && !node.isEnd;
  }

  update(oldTitle: string, newTitle: string, uuid: string): void {
    this.delete(oldTitle, uuid);
    this.add(newTitle, uuid);
  }
}
```

### Zustand 스토어

Trie 인스턴스를 직접 mutation하고, 배열(`titles`)을 함께 갱신하여 리렌더링을 트리거합니다.

```ts
// store/trie.ts
import {Trie} from '@utils/trie';
import {create} from 'zustand';

type State = { trie: Trie; titles: TitleAndUUID[] };
type Action = {
  setInit: (titles: TitleAndUUID[]) => void;
  addTitle: (title: string, uuid: string) => void;
  updateTitle: (oldTitle: string, newTitle: string, uuid: string) => void;
  deleteTitle: (title: string, uuid: string) => void;
  searchTitle: (title: string) => TitleAndUUID[];
};

export const useTrie = create<State & Action>((set, get) => ({
  trie: new Trie(),
  titles: [],

  setInit: titles => {
    const trie = new Trie(titles);       // 전체 데이터로 새 Trie 생성
    set({trie, titles});
  },

  addTitle: (title, uuid) => {
    const {trie, titles} = get();
    trie.add(title, uuid);               // 인스턴스 직접 mutation
    set({titles: [...titles, {title, uuid}]});  // 배열 교체로 리렌더
  },

  updateTitle: (oldTitle, newTitle, uuid) => {
    const {trie, titles} = get();
    trie.update(oldTitle, newTitle, uuid);
    set({titles: titles.map(t => (t.uuid === uuid ? {title: newTitle, uuid} : t))});
  },

  deleteTitle: (title, uuid) => {
    const {trie, titles} = get();
    trie.delete(title, uuid);
    set({titles: titles.filter(t => t.uuid !== uuid)});
  },

  searchTitle: title => get().trie.search(title),
}));
```

### 초기화 (InitTrie)

`wiki/layout.tsx`에서 렌더링하여 앱 진입 시 전체 문서 목록으로 Trie를 구축합니다.

```tsx
// components/layout/Trie/InitTrie.tsx
'use client';

import {useGetDocumentTitleList} from '@hooks/fetch/useGetDocumentTitleList';
import {useTrie} from '@store/trie';
import {useEffect} from 'react';

const InitTrie = () => {
  const {data} = useGetDocumentTitleList();      // 전체 문서 {title, uuid}[] 조회
  const setInit = useTrie(state => state.setInit);

  useEffect(() => {
    if (data) setInit(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return null;                                    // UI 없음 (초기화 전용)
};

export default InitTrie;
```

### 검색 흐름

```
사용자 입력 → WikiInputField (onChange)
  → useTrie.searchTitle(query)     // Trie에서 O(m) 검색 (m = 입력 길이)
  → 결과 목록 드롭다운 표시
  → 항목 클릭 → router.push(route.goWiki(uuid))
```

**Trie와 뮤테이션 동기화**: 문서 생성/수정 시 `usePostDocument`, `usePutDocument`의 `onSuccess`에서 `addTitle` / `updateTitle`을 호출하여 Trie를 실시간 갱신합니다.
