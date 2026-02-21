---
name: conventions
description: Crew Wiki Next 프로젝트의 코드 컨벤션, 아키텍처, 개발 패턴 가이드. 새 기능 구현, 코드 리뷰, 온보딩 시 참고. "컨벤션", "코드 스타일", "패턴", "어떻게 작성", "구조" 키워드에 반응.
user-invocable: true
---

# Crew Wiki Next - 개발 컨벤션 가이드

> 이 프로젝트에 새로 합류하는 팀원의 온보딩과 AI 기반 개발 요청 시 참고 문서입니다.

> **동기화 규칙**: 이 스킬의 파일(SKILL.md 또는 지원 파일)을 수정하면, 프로젝트 루트의 `CONVENTIONS.md`도 반드시 함께 갱신하세요. CONVENTIONS.md는 모든 스킬 파일의 통합본입니다.

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
