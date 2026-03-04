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
