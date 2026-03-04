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
