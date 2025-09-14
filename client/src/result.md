# 문서 충돌 해결 기능 구현 결과

## 1. 개요

`new_require.md` 명세서에 따라 문서 편집 시 발생할 수 있는 충돌을 감지하고, 사용자가 직접 내용을 병합하여 안전하게 저장할 수 있는 기능을 구현했습니다. 라이브러리 의존성 없이 직접 라인별 비교 알고리즘을 작성하여 충돌 해결 로직을 구현했습니다.

---

## 2. 주요 변경 사항

### 2.1. 데이터 모델 및 상태 관리 (`client/src/store/document.ts`)

- **`originalVersion` 상태 추가**: 문서 편집 시작 시점의 버전을 저장하기 위해 `useDocument` store에 `originalVersion: number` 상태를 추가했습니다.
- **`setInit` 액션 수정**: `setInit` 함수가 `version`을 인자로 받아 `originalVersion` 상태를 설정하도록 수정했습니다.

### 2.2. 타입 정의 (`client/src/type/Document.type.ts`)

- **`WikiDocument` 인터페이스 확장**: 백엔드에서 `version` 정보를 함께 제공한다는 가정하에, `WikiDocument` 인터페이스에 `version: number` 필드를 추가했습니다.

### 2.3. 문서 편집 페이지 (`client/src/app/wiki/[uuid]/edit/page.tsx`)

- **`originalVersion` 설정**: 페이지 진입 시 `useGetDocumentByUUID` 훅을 통해 받아온 문서 정보에서 `version` 값을 `useDocument` store의 `setInit` 함수로 전달하여 `originalVersion`을 설정하도록 수정했습니다.

### 2.4. 충돌 비교 알고리즘 (`client/src/utils/createConflictText.ts`)

- **라인별 비교 알고리즘 구현**: 라이브러리 없이 두 텍스트(서버 최신 버전, 로컬 편집 내용)를 비교하는 함수를 직접 작성했습니다.
  - `findFirstDiffIndex`: 두 텍스트의 시작 부분에서 처음으로 달라지는 줄의 인덱스를 찾습니다.
  - `findLastDiffIndex`: 두 텍스트의 끝 부분에서 처음으로 달라지는 줄의 인덱스를 찾습니다.
  - `createConflictText`: 위의 함수들을 사용하여 공통 부분과 다른 부분을 구분하고, `<<<<<`, `=====`, `>>>>>` 마커를 포함한 충돌 형식의 텍스트를 생성합니다.

### 2.5. 충돌 해결 UI (`client/src/components/document/Write/ConflictModal.tsx`)

- **`ConflictModal` 컴포넌트 생성**: React Portal을 사용하여 모달 UI를 구현했습니다.
  - TUI Editor를 내장하여 사용자가 충돌 내용을 직접 수정하고 병합할 수 있도록 했습니다.
  - 충돌 마커(`<<<<<` 등)가 모두 제거되어야 '충돌 해결 완료' 버튼이 활성화됩니다.
  - '취소' 또는 '충돌 해결 완료' 시 부모 컴포넌트로 해당 이벤트를 전달합니다.

### 2.6. 핵심 로직 및 UI 통합 (`client/src/components/document/Write/PostHeader.tsx`)

- **`RequestButton` 컴포넌트 수정**: '작성완료' 버튼의 로직을 다음과 같이 대폭 수정했습니다.
  1.  **충돌 감지**: `onSubmit` 시, `getDocumentLogsByUUIDClient` API를 호출하여 최신 버전(`latestVersion`)을 가져옵니다.
  2.  **조건 분기**: 로컬에 저장된 `originalVersion`과 `latestVersion`을 비교합니다.
      - **(충돌 없음)** 버전이 동일하면, 기존의 `putDocument` 함수를 호출하여 문서를 저장합니다.
      - **(충돌 발생)** 버전이 다르면, `getDocumentByUUIDClient`로 최신 내용을 가져온 뒤 `createConflictText` 유틸리티를 사용해 병합용 텍스트를 생성하고, `ConflictModal`을 엽니다.
  3.  **충돌 해결**: 사용자가 모달에서 '충돌 해결 완료' 버튼을 클릭하면 `handleResolve` 함수가 실행됩니다.
  4.  **재충돌 방지**: `handleResolve` 함수 내부에서 다시 한번 최신 버전을 체크하여, 병합하는 동안 또 다른 충돌이 발생했는지 확인합니다. 재충돌 시 사용자에게 알리고 새로고침을 유도합니다.
  5.  **최종 저장**: 재충돌이 없으면, 병합된 내용으로 `putDocument`를 호출하여 최종 저장합니다.

### 2.7. API 훅 (`client/src/hooks/fetch/useGetDocumentLogsByUUID.ts`)

- **`useGetDocumentLogsByUUID` 훅 추가**: 문서의 로그 정보를 가져오기 위한 새로운 `useFetch` 기반 훅을 생성했습니다.

---

## 3. 가정

- 백엔드의 `getDocumentByUUID` API가 반환하는 `WikiDocument` 객체에 `version` 정보가 포함되어 있다고 가정하고 진행했습니다.
