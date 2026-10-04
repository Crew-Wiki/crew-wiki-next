# CrewWiki 문서 관계 그래프 구현 가이드

옵시디언 graph view 스타일의 문서 관계 시각화를 `react-force-graph-2d`로 구현한다.
**이 레포(crew-wiki-next)의 실제 컨벤션에 맞춰 작성했다.** 직접 개발하면서 순서대로 따라갈 수 있게 파일 단위로 쪼갰고, 각 파일마다 "왜 이렇게 쓰는지"와 "레포의 어떤 선례를 따랐는지"를 붙였다.

작업 전 `.claude/skills/conventions/` (또는 루트 `CONVENTIONS.md`)의 다음 섹션을 함께 열어두면 좋다.

- 섹션 5 API 요청 아키텍처 / 섹션 6 커스텀 훅 (`api-and-data.md`)
- 섹션 4 컴포넌트 컨벤션 (`architecture.md`)
- 섹션 9 스타일링 / 섹션 10 에러 처리 / 섹션 11 캐시 (`ui-and-style.md`)

---

## 0. 요약

| 항목 | 결정 |
|---|---|
| 프레임워크 | Next.js 15.5 App Router + React 19.2 (레포 현행) |
| 렌더러 | `react-force-graph-2d` (Canvas 2D), 내장 d3-force |
| 데이터 소스 | `GET /graph?generation={g}&organizationDocumentUuid={uuid?}` |
| 응답 타입 | `CrewGraphResponse` — `@apis/generated/types`에 **이미 생성돼 있음** |
| 서버 상태 | `useFetch` (레포 자체 훅). **TanStack Query 도입하지 않는다** |
| 화면 상태 | URL search params (공유 가능한 그래프 뷰) |
| 좌표 상태 | `useRef` — React state 금지 |
| 테마 | 라이트 단일. `@constants/colors`의 primary/secondary/grayscale 토큰 사용 |
| 페이지 경로 | `/wiki/graph` (위키 레이아웃 하위) |
| 기수 목록 | 목록 API가 없어 `constants/graph.ts`에 하드코딩 (섹션 3) |
| 조직 필터 | `?org=` 파라미터만 지원. 선택 UI·진입점은 이번 범위 밖 (섹션 3) |
| 목표 규모 | 노드 1,000 / 간선 3,000까지 60fps |

### 원본 라이브러리 가이드와 달라진 점

인터넷에서 보는 `react-force-graph` 예제를 그대로 붙이면 이 레포에서는 컨벤션이 깨진다. 아래가 치환 규칙이다.

| 일반 예제 | 이 레포 |
|---|---|
| `@tanstack/react-query`의 `useQuery` | `@hooks/useFetch` + `hooks/fetch/useGet*` 훅 |
| `QueryClientProvider` 세팅 | 불필요 (Provider 없음) |
| `fetch()` 직접 호출 | `requestGetClient` / `requestGetServer` (`@http/*`) |
| 응답에서 `body.data` 꺼내기 | `requestGetClient`가 이미 `.data`를 벗겨서 반환한다 |
| `features/graph/` 폴더 | `components/graph/` + `hooks/fetch/` + `utils/graph/` + `constants/` 로 분산 |
| API 응답 타입 직접 선언 | `@apis/generated/types` 사용 (직접 선언 금지) |
| `next-themes`로 다크 모드 | 라이트 단일. `@constants/colors` |
| `npm i` | `cd client && yarn add` |
| `process.env.NEXT_PUBLIC_API_BASE_URL` | `process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL` |

---

## 1. 설치

```bash
cd client
yarn add react-force-graph-2d d3-force
yarn add -D @types/d3-force
```

`d3-force`를 별도로 넣는 이유는 `forceCollide`(노드 겹침 방지)를 직접 주입하기 위해서다. 겹침 방지를 포기하면 `react-force-graph-2d`만으로 충분하다.

설치 후 확인:

```bash
yarn typecheck   # tsc --noEmit
yarn dev
```

> React 19 peer dependency 경고가 뜰 수 있다. yarn 1은 경고만 내고 설치는 진행한다. 런타임에 문제가 없으면 무시하고, 타입 충돌이 나면 아래 섹션 12의 `useRef` / ref 타이핑 항목을 먼저 확인한다.

---

## 2. 이미 준비된 것 / 만들어야 하는 것

### 이미 있다 (건드리지 않는다)

```
client/src/apis/generated/types.ts            CrewGraphResponse, GraphNodeResponse, GraphEdgeResponse
client/src/apis/generated/client/graph.ts     graph.get() (client)
client/src/apis/generated/server/graph.ts     graph.get() (server)
client/src/apis/generated/operations.ts       'GET /graph': {query: {generation, organizationDocumentUuid?}}
```

생성된 타입은 이렇다. 그래프 도메인 타입을 **다시 선언하지 말고 이걸 import한다.**

```ts
export interface CrewGraphResponse {
  nodes: GraphNodeResponse[];
  edges: GraphEdgeResponse[];
}

export interface GraphNodeResponse {
  documentUuid: string;
  title: string;
  type: 'CREW' | 'ORGANIZATION';
}

export interface GraphEdgeResponse {
  sourceDocumentUuid: string;
  targetDocumentUuid: string;
  type: 'REFERENCE' | 'ORGANIZATION_LINK';
}
```

> **`apis/generated/client/graph.ts`를 직접 쓸까?**
> 현재 레포에서 생성된 호출 트리(`apis/generated/client|server/*`)를 사용하는 코드는 **아직 하나도 없다.** 모든 호출은 손으로 쓴 `apis/client/*.ts` / `apis/server/*.ts`를 경유한다. 그래서 이 가이드는 기존 선례를 따라 `apis/client/graph.ts`를 새로 만든다. 팀에서 "이제부터 생성 트리를 직접 쓴다"로 정했다면 섹션 5를 건너뛰고 `import {graph} from '@apis/generated/client/graph'`를 훅에서 바로 호출하면 된다. 둘을 섞지만 말자.

### 만들어야 한다

| 순서 | 파일 | 신규/수정 | 내용 |
|---|---|---|---|
| 1 | `constants/endpoint.ts` | 수정 | `getCrewGraph` 추가 |
| 2 | `constants/urls.ts` | 수정 | `wikiGraph` 추가 |
| 3 | `constants/route.ts` | 수정 | `goWikiGraph` 추가 |
| 4 | `constants/graph.ts` | 신규 | 색·크기·물리 파라미터 토큰 |
| 5 | `components/graph/type.ts` | 신규 | 캔버스 전용 내부 타입 |
| 6 | `utils/graph/buildIndex.ts` | 신규 | 정규화 + 인접 리스트 (순수 함수) |
| 7 | `utils/graph/toGraphData.ts` | 신규 | 응답 → 캔버스 입력 변환 + 좌표 보존 |
| 8 | `apis/client/graph.ts` | 신규 | `getCrewGraphClient` |
| 9 | `hooks/fetch/useGetCrewGraph.ts` | 신규 | `useFetch` 래핑 + 좌표 캐시 |
| 10 | `app/wiki/graph/useGraphParams.ts` | 신규 | URL search params 상태 훅 |
| 11 | `components/graph/GraphView.tsx` | 신규 | `dynamic(ssr:false)` 경계 |
| 12 | `components/graph/CrewGraph.tsx` | 신규 | 캔버스 본체 |
| 13 | `components/graph/GraphControls.tsx` | 신규 | 기수/검색/depth/범례 |
| 14 | `app/wiki/graph/page.tsx` | 신규 | 페이지 (Server Component) |
| 15 | `components/layout/Header/RightHeader.tsx` | 수정(선택) | 진입 링크 |

`apis/server/graph.ts` + `apiConfig.ts` 캐시 정책은 **서버 프리페치를 할 때만** 필요하다. 섹션 14의 선택지를 참고.

### 폴더 위치 근거

- `components/graph/` — 새 도메인 폴더. `components/group/`처럼 서브폴더 없이 파일을 평평하게 둔 선례가 있다. 공통 컴포넌트가 아니므로 `common/`에 넣지 않고, Storybook 스토리도 필수는 아니다(공통 컴포넌트에만 작성한다).
- `utils/graph/` — React 의존성이 없는 순수 함수. `utils/trie.ts`와 같은 성격이다.
- `app/wiki/graph/useGraphParams.ts` — 그 페이지에서만 쓰는 훅은 페이지 폴더에 둔다. `app/wiki/post/usePostSaveMarkdown.ts` 선례.

---

## 3. 백엔드 공백에 대한 결정

`/graph`는 `generation`(필수)과 `organizationDocumentUuid`(선택)를 받지만, **그 두 값의 후보 목록을 주는 API가 없다.** 아래는 그 공백을 어떻게 메울지에 대한 결정이며, 이 가이드의 나머지 코드는 이 결정을 전제로 쓰였다.

### (1) 기수 목록 → `constants/graph.ts`에 하드코딩

`GET /document/crews?generation=`은 "특정 기수에 속한 크루 목록"이고, 기수 자체의 목록을 주는 엔드포인트는 없다. 그래서 `GENERATION_OPTIONS` 상수로 두고 컨트롤의 기수 선택 UI는 이 배열을 렌더한다 (섹션 4).

- 상수 위에 `TODO` 주석을 남긴다. 나중에 목록 API가 생기면 상수를 `hooks/fetch/useGetGenerations.ts`로 갈아끼우고, 이 상수를 참조하는 곳은 컨트롤 하나뿐이라 교체 비용이 작다.
- **배열 값은 실제 기수로 맞춰야 한다.** 가이드에는 `['1'..'7']`로 적어뒀지만 이건 자리표시자다. 없는 기수를 선택하면 빈 그래프가 뜨는 게 전부라 위험하진 않지만, 있는 기수가 목록에 없으면 사용자가 볼 방법이 사라진다.
- `DEFAULT_GENERATION`은 `useGraphParams`가 `?generation=`이 없을 때 쓰는 값이다. **가장 최근 기수로 두는 게 맞다** — 그래프에 처음 들어온 사람이 보고 싶은 건 1기가 아니다.

### (2) 조직 필터 → URL 파라미터만 지원, 진입 UI는 만들지 않는다

조직 문서 목록 API도 없다(있는 건 `GET /organization/uuid/{uuid}` 단건과 `GET /document/{uuid}/organization-documents`뿐). 따라서 이번 범위는 이렇게 나눈다.

| 만든다 | 만들지 않는다 |
|---|---|
| `useGraphParams`가 `?org=`를 읽어 `organizationDocumentUuid`로 API에 전달 | 컨트롤 패널의 조직 선택 UI |
| 조직 노드를 `secondary` 색으로 렌더 | 그래프 밖에서 조직을 고르는 진입점 (헤더·그룹 페이지 링크 등) |
| `ORGANIZATION_LINK` 간선을 점선으로 렌더 | 조직 노드 클릭 → 필터 적용 동작 |
| 범례에 조직 색·점선 표기 | |

즉 **`?org=<uuid>`를 손으로 붙였을 때 조직 노드와 점선 간선이 제대로 그려지는 것까지가 완료 조건이다.** 렌더링 코드는 전부 들어가므로, 나중에 진입 UI만 얹으면 동작한다.

컨트롤에 조직 관련 컴포넌트를 넣지 않으므로 `GraphControls`의 props에서도 `organizationDocumentUuid`를 다루지 않는다. `setParams`는 이미 그 키를 지원하니 훅은 손댈 필요가 없다.

### 코드 쓰기 전 확인

응답을 한 번 눈으로 보면 위 결정이 실제와 맞는지 검증된다. 특히 `?org=` 없이도 조직 노드가 오는지가 범례·색 처리에 영향을 준다.

```bash
curl "$BACKEND/graph?generation=1" | jq '{nodes: (.data.nodes|length), edges: (.data.edges|length), nodeTypes: (.data.nodes|map(.type)|unique), edgeTypes: (.data.edges|map(.type)|unique)}'
curl "$BACKEND/graph?generation=1&organizationDocumentUuid=<uuid>" | jq '.data.edges|map(.type)|unique'
```

---

## 4. 상수와 라우팅 (파일 1~4)

### `constants/endpoint.ts` (수정)

`ENDPOINT`는 백엔드 엔드포인트의 단일 목록이다. 여기에 추가하지 않고 문자열을 직접 쓰면 컨벤션 위반이다.

```ts
export const ENDPOINT = {
  // ... 기존 항목
  // Graph
  getCrewGraph: '/graph',
} as const;
```

`CLIENT_ENDPOINT`(Route Handler용)에는 추가하지 않는다. 그래프는 읽기 전용이라 BFF를 경유할 이유가 없다.

### `constants/urls.ts` (수정)

```ts
export const URLS = {
  main: '/',
  wiki: '/wiki',
  wikiGroups: '/wiki/groups',
  wikiGraph: '/wiki/graph', // 추가
  // ...
};
```

### `constants/route.ts` (수정)

`next.config.ts`에 `typedRoutes: true`가 켜져 있어서 `router.push`에 들어가는 문자열은 타입 검증을 받는다. 기존 함수들처럼 `as Route`로 단언한 이동 함수를 만들어 두고 컴포넌트에서는 이 함수만 쓴다.

```ts
export const route = {
  // ... 기존 항목
  goWikiGraph: () => URLS.wikiGraph as Route,
  goWikiGraphWithFocus: (uuid: string) => `${URLS.wikiGraph}?focus=${uuid}` as Route,
};
```

### `constants/graph.ts` (신규)

색은 `@constants/colors`에서 가져온다. 캔버스는 Tailwind 클래스를 쓸 수 없어 hex 값이 직접 필요하므로, 하드코딩 대신 토큰을 참조한다.

```ts
import {colors} from '@constants/colors';
import type {GraphEdgeResponse, GraphNodeResponse} from '@apis/generated/types';

type NodeType = GraphNodeResponse['type'];
type EdgeType = GraphEdgeResponse['type'];

/** 캔버스는 Tailwind 클래스를 쓸 수 없어 hex 값이 필요하다. 하드코딩하지 말고 colors 토큰을 참조한다 */
export const GRAPH_COLOR = {
  node: {
    CREW: colors.primary[400],
    ORGANIZATION: colors.secondary[400],
  } satisfies Record<NodeType, string>,
  link: {
    REFERENCE: 'rgba(79, 80, 82, 0.35)', // grayscale-600 기반
    ORGANIZATION_LINK: 'rgba(185, 37, 180, 0.45)', // secondary-400 기반
  } satisfies Record<EdgeType, string>,
  label: colors.grayscale[800],
  ring: colors.grayscale[900],
  dimmed: 'rgba(159, 160, 162, 0.12)', // grayscale-400 기반
} as const;

/** 이웃이 아닌 요소의 불투명도 */
export const DIM_ALPHA = 0.12;
/** 이 배율 이상에서 라벨을 항상 표시 */
export const LABEL_ZOOM = 1.4;
export const MIN_RADIUS = 3.5;
export const RADIUS_SCALE = 1.9;

export const radiusOf = (degree: number): number => MIN_RADIUS + Math.sqrt(degree) * RADIUS_SCALE;

/** d3-force 파라미터. 값 조정은 섹션 16 튜닝표 참고 */
export const GRAPH_FORCE = {
  chargeStrength: -140,
  chargeDistanceMax: 420,
  linkDistance: 58,
  linkStrength: 0.55,
  centerStrength: 0.04,
  collidePadding: 5,
} as const;

/** 로컬 그래프 depth 범위 */
export const GRAPH_DEPTH = {min: 1, max: 3, default: 1} as const;

/**
 * TODO: 백엔드에 기수 목록 API 가 없어 하드코딩한다. 목록 API 가 생기면 조회 훅으로 교체한다.
 * 아래 값은 자리표시자다. 실제 기수 범위로 맞춰서 넣을 것 (섹션 3 참고)
 */
export const GENERATION_OPTIONS = ['1', '2', '3', '4', '5', '6', '7'] as const;

/** ?generation= 이 없을 때의 기본값. 가장 최근 기수로 둔다 */
export const DEFAULT_GENERATION = '7';
```

색상 규칙: `CREW` / `ORGANIZATION`은 **범주**를 인코딩한다. 순서나 장식이 아니다. 그리고 간선은 색만으로 구분하지 않고 `ORGANIZATION_LINK`를 점선으로 함께 표시한다(색각 이상 대응).

---

## 5. 캔버스 내부 타입 (파일 5)

### `components/graph/type.ts` (신규)

API 타입은 `@apis/generated/types`에서 오지만, `react-force-graph-2d`가 요구하는 형태(노드에 좌표, 키 이름이 `links`)는 다르다. 이 **뷰 전용 타입만** 여기에 선언한다. `type/` 폴더는 라이브러리·프레임워크 타입 전용이라 도메인 타입을 넣지 않는다 (컨벤션 섹션 8). `components/group/type.ts`가 같은 선례다.

```ts
import type {GraphEdgeResponse, GraphNodeResponse} from '@apis/generated/types';

export type GraphNodeType = GraphNodeResponse['type'];
export type GraphEdgeType = GraphEdgeResponse['type'];

/** x/y/vx/vy 는 시뮬레이션이 런타임에 노드 객체에 직접 심는다. 우리가 초기값을 줄 수도 있다 */
export interface GraphNode {
  id: string;
  title: string;
  type: GraphNodeType;
  degree: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

/** 주의: 시뮬레이션이 시작되면 source/target 이 uuid 문자열에서 GraphNode 객체로 치환된다 */
export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: GraphEdgeType;
}

/** graphData prop 형태. 키가 edges 가 아니라 links 다 */
export interface ForceGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface GraphIndex {
  nodeById: Map<string, GraphNode>;
  adjacency: Map<string, Set<string>>;
  degree: Map<string, number>;
}

/** source/target 이 객체로 치환됐을 수 있으므로 항상 이걸로 꺼낸다 */
export const linkEndId = (end: string | GraphNode): string => (typeof end === 'object' ? end.id : end);
```

---

## 6. 정규화와 인접 리스트 (파일 6)

hover 하이라이트, 로컬 그래프, 노드 크기가 전부 "이웃 조회"에 의존한다. 간선 배열을 그대로 두면 조회마다 O(E)이므로 인접 리스트로 한 번 변환한다.

### `utils/graph/buildIndex.ts` (신규)

```ts
import type {CrewGraphResponse} from '@apis/generated/types';
import type {GraphIndex, GraphNode} from '@components/graph/type';

/** 무방향 간선의 정규화 키 */
export const edgeKey = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`);

export const buildIndex = (response: CrewGraphResponse): GraphIndex => {
  const adjacency = new Map<string, Set<string>>();

  for (const node of response.nodes) {
    if (adjacency.has(node.documentUuid)) continue; // 중복 노드
    adjacency.set(node.documentUuid, new Set());
  }

  const seenEdges = new Set<string>();
  for (const edge of response.edges) {
    const source = edge.sourceDocumentUuid;
    const target = edge.targetDocumentUuid;

    if (!adjacency.has(source) || !adjacency.has(target)) continue; // dangling edge
    if (source === target) continue; // self-loop

    const key = edgeKey(source, target);
    if (seenEdges.has(key)) continue; // 중복 간선
    seenEdges.add(key);

    adjacency.get(source)!.add(target);
    adjacency.get(target)!.add(source);
  }

  const degree = new Map<string, number>();
  for (const [id, neighbors] of adjacency) degree.set(id, neighbors.size);

  const nodeById = new Map<string, GraphNode>();
  for (const node of response.nodes) {
    if (nodeById.has(node.documentUuid)) continue;
    nodeById.set(node.documentUuid, {
      id: node.documentUuid,
      title: node.title,
      type: node.type,
      degree: degree.get(node.documentUuid) ?? 0,
    });
  }

  return {nodeById, adjacency, degree};
};

/** 특정 노드에서 depth 단계 이내의 노드 집합 (로컬 그래프). BFS */
export const localGraph = (index: GraphIndex, root: string, depth: number): Set<string> => {
  const seen = new Set<string>([root]);
  if (!index.adjacency.has(root)) return seen;

  let frontier: string[] = [root];
  for (let d = 0; d < depth; d++) {
    const next: string[] = [];
    for (const id of frontier) {
      for (const neighbor of index.adjacency.get(id) ?? []) {
        if (seen.has(neighbor)) continue;
        seen.add(neighbor);
        next.push(neighbor);
      }
    }
    if (next.length === 0) break;
    frontier = next;
  }

  return seen;
};
```

**dangling edge 폐기는 선택이 아니라 필수다.** `nodes`에 없는 uuid를 참조하는 간선이 하나라도 있으면 d3-force가 `Error: missing: <uuid>`를 던지며 렌더 전체가 죽는다. 조직 노드를 조건부로 붙이는 `/graph` 구조상 실제로 발생할 여지가 있다.

---

## 7. 캔버스 입력 변환과 좌표 보존 (파일 7)

### `utils/graph/toGraphData.ts` (신규)

```ts
import type {CrewGraphResponse} from '@apis/generated/types';
import type {ForceGraphData, GraphIndex, GraphLink} from '@components/graph/type';
import {edgeKey} from './buildIndex';

export type PositionCache = Map<string, {x: number; y: number}>;

/**
 * 라이브러리가 nodes/links 배열과 그 안의 객체를 직접 mutate 한다.
 * useFetch 가 들고 있는 응답 객체를 그대로 넘기면 상태가 오염되므로 반드시 새 객체로 만든다.
 *
 * prevPositions 가 있으면 같은 uuid 의 이전 좌표를 초기값으로 복원한다.
 * 이게 없으면 기수를 바꿀 때마다 모든 노드가 화면 중앙에서 폭발한다.
 */
export const toGraphData = (
  response: CrewGraphResponse,
  index: GraphIndex,
  prevPositions?: PositionCache,
): ForceGraphData => {
  const nodes = [...index.nodeById.values()].map(node => {
    const prev = prevPositions?.get(node.id);
    return {...node, ...(prev ? {x: prev.x, y: prev.y} : {})};
  });

  const emitted = new Set<string>();
  const links: GraphLink[] = [];

  for (const edge of response.edges) {
    const source = edge.sourceDocumentUuid;
    const target = edge.targetDocumentUuid;
    if (!index.nodeById.has(source) || !index.nodeById.has(target) || source === target) continue;

    const key = edgeKey(source, target);
    if (emitted.has(key)) continue;
    emitted.add(key);

    links.push({source, target, type: edge.type});
  }

  return {nodes, links};
};

/** 현재 시뮬레이션 좌표를 캐시에 스냅샷. 데이터 교체 직전에 호출한다 */
export const snapshotPositions = (data: ForceGraphData): PositionCache => {
  const cache: PositionCache = new Map();
  for (const node of data.nodes) {
    if (typeof node.x === 'number' && typeof node.y === 'number') {
      cache.set(node.id, {x: node.x, y: node.y});
    }
  }
  return cache;
};
```

---

## 8. Client API (파일 8)

### `apis/client/graph.ts` (신규)

`apis/client/document.ts`와 동일한 패턴이다. 읽기이므로 백엔드를 직접 호출한다(BFF 불필요). `requestGetClient`가 `{data, code}` 래퍼를 벗겨 `T`를 그대로 반환하므로 응답에서 `.data`를 다시 꺼내면 안 된다.

```ts
'use client';

import type {CrewGraphResponse} from '@apis/generated/types';
import {ENDPOINT} from '@constants/endpoint';
import {toQueryParams} from '@http/common';
import {requestGetClient} from '@http/client';

export type CrewGraphQuery = {
  generation: string;
  organizationDocumentUuid?: string;
};

export const getCrewGraphClient = async (query: CrewGraphQuery) => {
  const response = await requestGetClient<CrewGraphResponse>({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
    endpoint: ENDPOINT.getCrewGraph,
    queryParams: toQueryParams(query),
  });

  return response;
};
```

`toQueryParams`가 `undefined` / `null` 값을 제거하므로 `organizationDocumentUuid`가 없을 때 `?org=undefined`가 붙는 사고가 없다. 직접 객체 리터럴을 `queryParams`에 넘기지 말고 항상 이 함수를 거친다.

---

## 9. 조회 훅 (파일 9)

### `hooks/fetch/useGetCrewGraph.ts` (신규)

`useFetch`의 계약을 먼저 기억하자 (`hooks/useFetch.ts`).

```ts
useFetch<T>(fetchFunction: () => Promise<T>, options?: {enabled?: boolean})
// 반환: {data, isLoading, errorMessage, refetch, setData}
```

내부 `useEffect`가 `fetchFunction`을 의존성에 넣기 때문에 **인라인 화살표 함수를 넘기면 매 렌더마다 재요청한다.** 파라미터가 있는 훅은 `useCallback`이 필수다 (`useGetDocumentByTitle` 선례).

```ts
'use client';

import {useCallback, useEffect, useMemo, useRef} from 'react';
import type {CrewGraphResponse} from '@apis/generated/types';
import {getCrewGraphClient, type CrewGraphQuery} from '@apis/client/graph';
import {useFetch} from '@hooks/useFetch';
import {buildIndex} from '@utils/graph/buildIndex';
import {snapshotPositions, toGraphData, type PositionCache} from '@utils/graph/toGraphData';
import type {ForceGraphData, GraphIndex} from '@components/graph/type';

export const useGetCrewGraph = ({generation, organizationDocumentUuid}: CrewGraphQuery) => {
  // 인라인 함수를 넘기면 useFetch 내부 useEffect 가 매 렌더 재실행된다
  const getCrewGraph = useCallback(
    () => getCrewGraphClient({generation, organizationDocumentUuid}),
    [generation, organizationDocumentUuid],
  );

  const {data, isLoading, errorMessage} = useFetch<CrewGraphResponse>(getCrewGraph);

  const positions = useRef<PositionCache>(new Map());
  const dataRef = useRef<ForceGraphData | null>(null);

  const index: GraphIndex | null = useMemo(() => (data ? buildIndex(data) : null), [data]);

  // graphData 의 객체 identity 가 바뀌면 시뮬레이션이 재가열된다.
  // 따라서 응답이 실제로 바뀔 때만 새로 만든다
  const graphData: ForceGraphData | null = useMemo(() => {
    if (!data || !index) return null;
    if (dataRef.current) positions.current = snapshotPositions(dataRef.current);

    const next = toGraphData(data, index, positions.current);
    dataRef.current = next;
    return next;
  }, [data, index]);

  // 언마운트 시에도 좌표를 남긴다 (라우트 이동 후 복귀 대응)
  useEffect(
    () => () => {
      if (dataRef.current) positions.current = snapshotPositions(dataRef.current);
    },
    [],
  );

  return {graphData, index, isLoading, errorMessage};
};
```

주의할 점:

- `useFetch`는 요청 중에도 이전 `data`를 유지한다. 그래서 기수를 바꾸면 새 응답이 오기 전까지 이전 그래프가 화면에 남는다. 이건 깜빡임이 없어 오히려 낫지만, "로딩 중"을 알리려면 `isLoading`으로 오버레이를 얹는다.
- `useFetch`에는 요청 취소(AbortSignal)가 없다. 기수를 빠르게 연타하면 늦게 도착한 응답이 나중에 덮어쓸 수 있다. 실사용에서 문제가 되면 컨트롤에 `useDebounce`(레포에 있음)를 걸어 호출 빈도를 줄인다.
- 에러는 `errorMessage: string | null`이다. TanStack Query의 `error` 객체가 아니다.

---

## 10. URL 상태 훅 (파일 10)

그래프 뷰는 링크로 공유된다. 기수·조직·포커스 노드·depth를 전부 search params에 둔다.

### `app/wiki/graph/useGraphParams.ts` (신규)

```ts
'use client';

import {useCallback, useMemo} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import type {Route} from 'next';
import {DEFAULT_GENERATION, GRAPH_DEPTH} from '@constants/graph';

export interface GraphParams {
  generation: string;
  organizationDocumentUuid?: string;
  focusUuid?: string;
  depth: number;
}

export const useGraphParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params: GraphParams = useMemo(
    () => ({
      generation: searchParams.get('generation') ?? DEFAULT_GENERATION,
      organizationDocumentUuid: searchParams.get('org') ?? undefined,
      focusUuid: searchParams.get('focus') ?? undefined,
      depth: Math.min(
        GRAPH_DEPTH.max,
        Math.max(GRAPH_DEPTH.min, Number(searchParams.get('depth') ?? GRAPH_DEPTH.default)),
      ),
    }),
    [searchParams],
  );

  const setParams = useCallback(
    (patch: Partial<GraphParams>) => {
      const next = new URLSearchParams(searchParams.toString());

      const apply = (key: string, value: string | number | undefined) => {
        if (value === undefined || value === '') next.delete(key);
        else next.set(key, String(value));
      };

      if ('generation' in patch) apply('generation', patch.generation);
      if ('organizationDocumentUuid' in patch) apply('org', patch.organizationDocumentUuid);
      if ('focusUuid' in patch) apply('focus', patch.focusUuid);
      if ('depth' in patch) apply('depth', patch.depth);

      // typedRoutes: true 이므로 동적으로 만든 문자열은 단언이 필요하다
      router.replace(`${pathname}?${next}` as Route, {scroll: false});
    },
    [router, pathname, searchParams],
  );

  return {params, setParams};
};
```

`router.replace`는 컨트롤 조작 같은 저빈도 이벤트에서만 호출한다. hover마다 부르면 안 된다.

`'depth' in patch` 형태로 검사하는 이유: `setParams({focusUuid: undefined})`처럼 "지우기"를 표현해야 하는데, `patch.focusUuid === undefined`만 보면 "안 넘긴 것"과 구분되지 않는다.

---

## 11. dynamic 경계 (파일 11)

### 왜 필요한가

`react-force-graph-2d`는 모듈 최상단에서 `window`에 접근한다. Server Component는 물론이고 **Client Component의 서버 프리렌더 단계에서도 터진다.** 그래서 `ssr: false` 동적 임포트가 필수다.

그런데 App Router에서 **`ssr: false`는 Server Component 안에서 쓸 수 없다.** 그대로 쓰면 빌드가 이렇게 실패한다.

```
Error: `ssr: false` is not allowed with `next/dynamic` in Server Components.
```

경계를 3층으로 나눈다.

```
app/wiki/graph/page.tsx        Server Component  — 메타데이터, Suspense
└── components/graph/GraphView.tsx    'use client' — dynamic(ssr:false), URL 상태
    └── components/graph/CrewGraph.tsx 'use client' — ForceGraph2D 직접 import
```

`CrewGraph.tsx`는 클라이언트에서만 로드되므로 그 안에서는 `import ForceGraph2D from 'react-force-graph-2d'`를 평범하게 쓸 수 있고 ref 타이핑도 정상 동작한다. `dynamic` 호출은 한 층 위 `GraphView.tsx`에서만 한다.

> 이 패턴은 레포에 이미 있다. `components/layout/Header/WikiHeader.tsx`가 `dynamic(() => import('./RightHeader'), {ssr: false})`를 `'use client'` 파일 안에서 호출한다. Toast UI Editor(`components/document/TuiEditor/index.tsx`)도 같은 이유로 동적 임포트를 쓴다 (컨벤션 섹션 14).

### `components/graph/GraphView.tsx` (신규)

```tsx
'use client';

import dynamic from 'next/dynamic';
import {useCallback} from 'react';
import {useRouter} from 'next/navigation';
import {LoadingSpinner} from '@components/common/LoadingSpinner';
import {route} from '@constants/route';
import {useGraphParams} from '@app/wiki/graph/useGraphParams';
import GraphControls from './GraphControls';

// 이 파일이 'use client' 이므로 ssr: false 가 허용된다.
// Server Component 에서 호출하면 빌드가 실패한다
const CrewGraph = dynamic(() => import('./CrewGraph'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <LoadingSpinner size="m" thickness="thick" />
    </div>
  ),
});

const GraphView = () => {
  const router = useRouter();
  const {params, setParams} = useGraphParams();

  const handleSelect = useCallback((uuid: string) => setParams({focusUuid: uuid}), [setParams]);

  const handleOpen = useCallback((uuid: string) => router.push(route.goWiki(uuid)), [router]);

  return (
    <div className="relative h-full w-full">
      <CrewGraph
        generation={params.generation}
        organizationDocumentUuid={params.organizationDocumentUuid}
        focusUuid={params.focusUuid}
        focusDepth={params.depth}
        onSelect={handleSelect}
        onOpen={handleOpen}
      />
      <GraphControls params={params} onChange={setParams} />
    </div>
  );
};

export default GraphView;
```

문서 열기는 `route.goWiki(uuid)`를 쓴다. 그래프 노드는 크루 문서와 조직 문서가 섞여 있으니, 조직 노드는 `route.goWikiGroup(uuid)`로 분기해야 한다. `onOpen`에서 노드 타입을 함께 받도록 시그니처를 정하는 편이 깔끔하다.

```tsx
const handleOpen = useCallback(
  (uuid: string, type: GraphNodeType) =>
    router.push(type === 'ORGANIZATION' ? route.goWikiGroup(uuid) : route.goWiki(uuid)),
  [router],
);
```

---

## 12. 캔버스 컴포넌트 (파일 12)

### `components/graph/CrewGraph.tsx` (신규)

컴포넌트 내부 순서는 컨벤션 섹션 4를 따른다: import → 타입 → 외부 상수 → useState → useRef → 커스텀 훅 → useEffect → 핸들러 → return. 핸들러 이름은 내부 `handle*`, props 콜백 `on*`.

```tsx
'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import ForceGraph2D, {type ForceGraphMethods} from 'react-force-graph-2d';
import {forceCollide} from 'd3-force';
import {LoadingSpinner} from '@components/common/LoadingSpinner';
import {DIM_ALPHA, GRAPH_COLOR, GRAPH_FORCE, LABEL_ZOOM, radiusOf} from '@constants/graph';
import {useGetCrewGraph} from '@hooks/fetch/useGetCrewGraph';
import {localGraph} from '@utils/graph/buildIndex';
import {linkEndId, type GraphLink, type GraphNode, type GraphNodeType} from './type';

interface CrewGraphProps {
  generation: string;
  organizationDocumentUuid?: string;
  focusUuid?: string;
  focusDepth?: number;
  onSelect?: (uuid: string) => void;
  onOpen?: (uuid: string, type: GraphNodeType) => void;
}

const CrewGraph = ({
  generation,
  organizationDocumentUuid,
  focusUuid,
  focusDepth = 1,
  onSelect,
  onOpen,
}: CrewGraphProps) => {
  const [size, setSize] = useState({width: 0, height: 0});
  const [hoverId, setHoverId] = useState<string | null>(null);

  // React 19 의 useRef 는 초기값 인자가 필수다
  const graphRef = useRef<ForceGraphMethods<GraphNode, GraphLink> | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {graphData, index, isLoading, errorMessage} = useGetCrewGraph({generation, organizationDocumentUuid});

  /* 컨테이너 크기 추적 — width/height 를 명시하지 않으면 캔버스가 0px 로 잡힌다 */
  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const {width, height} = entry.contentRect;
      setSize({width: Math.round(width), height: Math.round(height)});
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  /* 로컬 그래프 필터 */
  const visible = useMemo(
    () => (index && focusUuid ? localGraph(index, focusUuid, focusDepth) : null),
    [index, focusUuid, focusDepth],
  );

  const viewData = useMemo(() => {
    if (!graphData) return {nodes: [], links: []};
    if (!visible) return graphData;

    return {
      nodes: graphData.nodes.filter(node => visible.has(node.id)),
      links: graphData.links.filter(
        link => visible.has(linkEndId(link.source)) && visible.has(linkEndId(link.target)),
      ),
    };
  }, [graphData, visible]);

  /* 하이라이트 집합: 자기 자신 + 직접 이웃 */
  const highlight = useMemo(() => {
    const active = hoverId ?? focusUuid;
    if (!active || !index) return null;

    const set = new Set<string>([active]);
    for (const neighbor of index.adjacency.get(active) ?? []) set.add(neighbor);
    return set;
  }, [hoverId, focusUuid, index]);

  /* force 파라미터 */
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph || viewData.nodes.length === 0) return;

    graph.d3Force('charge')?.strength(GRAPH_FORCE.chargeStrength).distanceMax(GRAPH_FORCE.chargeDistanceMax);
    graph.d3Force('link')?.distance(GRAPH_FORCE.linkDistance).strength(GRAPH_FORCE.linkStrength);
    graph.d3Force('center')?.strength(GRAPH_FORCE.centerStrength);
    graph.d3Force(
      'collide',
      forceCollide<GraphNode>(node => radiusOf(node.degree) + GRAPH_FORCE.collidePadding).iterations(2),
    );
    graph.d3ReheatSimulation();
  }, [viewData]);

  /* 노드 렌더 */
  const paintNode = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D, scale: number) => {
      const radius = radiusOf(node.degree);
      const dimmed = highlight ? !highlight.has(node.id) : false;

      ctx.globalAlpha = dimmed ? DIM_ALPHA : 1;
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, radius, 0, Math.PI * 2);
      ctx.fillStyle = GRAPH_COLOR.node[node.type];
      ctx.fill();

      if (node.id === focusUuid) {
        ctx.lineWidth = 2 / scale;
        ctx.strokeStyle = GRAPH_COLOR.ring;
        ctx.stroke();
      }

      const showLabel = scale > LABEL_ZOOM || node.id === hoverId || node.id === focusUuid;
      if (showLabel && !dimmed) {
        const fontSize = Math.max(10 / scale, 2);
        ctx.font = `${fontSize}px var(--font-pretendard), sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = GRAPH_COLOR.label;
        ctx.fillText(node.title, node.x!, node.y! + radius + 2 / scale);
      }

      ctx.globalAlpha = 1;
    },
    [highlight, focusUuid, hoverId],
  );

  // 커스텀 그리기를 쓰면 히트 영역도 직접 칠해야 클릭/hover 가 동작한다
  const paintPointerArea = useCallback((node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, radiusOf(node.degree) + 3, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  /* 간선 스타일 */
  const getLinkColor = useCallback(
    (link: GraphLink) => {
      if (!highlight) return GRAPH_COLOR.link[link.type];

      const active = highlight.has(linkEndId(link.source)) && highlight.has(linkEndId(link.target));
      return active ? GRAPH_COLOR.link[link.type] : GRAPH_COLOR.dimmed;
    },
    [highlight],
  );

  /* 인터랙션: 한 번 클릭은 선택(포커스), 우클릭은 문서 열기 */
  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      onSelect?.(node.id);
      graphRef.current?.centerAt(node.x, node.y, 400);
    },
    [onSelect],
  );

  if (errorMessage) {
    return (
      <div role="alert" className="flex h-full w-full items-center justify-center font-bm text-grayscale-800">
        그래프를 불러오지 못했어요.
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <LoadingSpinner size="m" thickness="thick" />
        </div>
      )}
      {!isLoading && viewData.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-grayscale-lightText">
          {generation}기에는 아직 연결된 문서가 없어요.
        </div>
      )}

      {size.width > 0 && size.height > 0 && (
        <ForceGraph2D<GraphNode, GraphLink>
          ref={graphRef}
          width={size.width}
          height={size.height}
          graphData={viewData}
          backgroundColor="transparent"
          /* 노드 */
          nodeId="id"
          nodeCanvasObject={paintNode}
          nodeCanvasObjectMode={() => 'replace'}
          nodePointerAreaPaint={paintPointerArea}
          /* 간선 */
          linkColor={getLinkColor}
          linkWidth={link => (link.type === 'ORGANIZATION_LINK' ? 1.4 : 1)}
          linkLineDash={link => (link.type === 'ORGANIZATION_LINK' ? [3, 3] : null)}
          /* 인터랙션 */
          onNodeHover={node => setHoverId(node ? node.id : null)}
          onNodeClick={handleNodeClick}
          onNodeRightClick={node => onOpen?.(node.id, node.type)}
          onBackgroundClick={() => onSelect?.('')}
          onNodeDragEnd={node => {
            node.fx = node.x;
            node.fy = node.y;
          }}
          enableNodeDrag
          /* 성능 */
          cooldownTicks={120}
          warmupTicks={20}
          d3AlphaDecay={0.025}
          d3VelocityDecay={0.35}
          onEngineStop={() => graphRef.current?.zoomToFit(400, 60)}
        />
      )}

      {/* 캔버스는 스크린리더가 읽지 못한다. 동등한 텍스트 경로를 함께 둔다 */}
      <ul className="sr-only">
        {viewData.nodes.map(node => (
          <li key={node.id}>
            <a href={`/wiki/${node.id}`}>
              {node.title} ({node.type === 'CREW' ? '크루 문서' : '조직 문서'}, 연결 {node.degree}개)
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrewGraph;
```

`sr-only` 유틸리티는 Tailwind 기본 제공이라 추가 설정이 필요 없다.

---

## 13. 컨트롤 패널 (파일 13)

### `components/graph/GraphControls.tsx` (요구사항)

`'use client'`. `GraphView`에서 `params` / `onChange`를 받아 **URL만 갱신한다. 자체 상태를 두지 않는다** (검색 입력값처럼 URL에 넣지 않는 것만 예외).

| 컨트롤 | 동작 | 재사용할 것 |
|---|---|---|
| 기수 선택 | `GENERATION_OPTIONS`를 렌더, `onChange({generation, focusUuid: undefined})` — 기수를 바꾸면 포커스는 푼다 | `@components/common/Chip` 또는 `Button` |
| 검색 | `index.nodeById`를 순회해 제목 부분 일치, 선택 시 `onChange({focusUuid})` | `@components/common/Input`, `useInput`, `@components/common/SearchTerms` |
| depth 슬라이더 | 1~3. `focusUuid`가 있을 때만 노출 | `<input type="range">` |
| 범례 | 크루/조직 색, 참조(실선)/조직 연결(점선) | — |
| 전체 보기 | `onChange({focusUuid: undefined})` | `@components/common/Button` |

**조직 필터 UI는 만들지 않는다** (섹션 3의 결정). `?org=`는 `useGraphParams`가 읽어 API로 전달되고 조직 노드·점선 간선은 렌더되지만, 컨트롤에는 조직 관련 요소를 넣지 않는다. 범례에는 조직 색과 점선을 표기한다 — `?org=`로 들어온 사용자가 색의 의미를 알아야 한다.

검색을 붙일 때 `index`가 필요하다. `GraphControls`가 별도로 API를 다시 부르지 말고, `CrewGraph`와 같은 `index`를 쓰려면 `GraphView`에서 `useGetCrewGraph`를 호출해 `index`를 두 컴포넌트에 내려주는 구조로 바꾼다. (같은 훅을 두 컴포넌트에서 각각 호출하면 요청이 두 번 나간다 — `useFetch`에는 캐시가 없다.)

스타일은 컨벤션 섹션 9를 따른다.

- 변형 매핑은 컴포넌트 상단의 `const XXX_STYLE = {...}` 객체 + `twMerge`
- 색은 `bg-primary-primary`, `text-grayscale-text`, `border-primary-100` 같은 토큰 클래스
- 반응형은 Desktop-first: `p-4 max-md:p-2`
- 폰트: 제목·버튼 `font-bm`, 본문 `font-pretendard`

버튼 문구는 동작을 그대로 쓴다. "적용"이 아니라 "기수 바꾸기", "확인"이 아니라 "문서 열기". 같은 동작은 화면 전체에서 같은 이름을 유지한다.

패널 배치 예시(캔버스 위 오버레이):

```tsx
<aside className="absolute left-4 top-4 z-20 flex w-[240px] flex-col gap-4 rounded-xl border border-solid border-primary-100 bg-white/95 p-4 max-md:w-[180px] max-md:p-2">
```

---

## 14. 페이지 (파일 14)

### `app/wiki/graph/page.tsx` (신규)

이 페이지는 `app/wiki/layout.tsx` 아래에 들어가므로 `WikiHeader`, `InitTrie`, `RecentlyEdit`이 자동으로 붙는다. 레이아웃의 `main`이 `max-w-[1440px] px-4 py-6`을 걸어주니 페이지에서는 카드와 높이만 정한다.

```tsx
import {Suspense} from 'react';
import type {Metadata} from 'next';
import {LoadingSpinner} from '@components/common/LoadingSpinner';
import GraphView from '@components/graph/GraphView';

export const metadata: Metadata = {
  title: '문서 관계 그래프 | 크루위키',
  description: '기수별 크루 문서와 조직 문서의 연결 관계를 살펴봅니다.',
};

const GraphPage = () => {
  return (
    <div className="flex w-full flex-col gap-6 max-[768px]:gap-2">
      <section className="h-[calc(100dvh-14rem)] min-h-[520px] w-full overflow-hidden rounded-xl border border-solid border-primary-100 bg-white p-2 max-md:p-1">
        {/* useSearchParams 를 쓰는 컴포넌트는 Suspense 로 감싸야 한다.
            없으면 빌드 경고가 나고 페이지 전체가 CSR 로 강등된다 */}
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <LoadingSpinner size="m" thickness="thick" />
            </div>
          }
        >
          <GraphView />
        </Suspense>
      </section>
    </div>
  );
};

export default GraphPage;
```

**높이 주의.** 다른 위키 페이지는 `min-h-[864px]`로 세로를 키우고 스크롤하는 구조지만, 그래프는 뷰포트에 맞춰야 한다. `WikiHeader`가 `sticky`(추정 높이 160px)이고 `main`에 `py-6`이 있으므로 `calc(100dvh-14rem)` 정도가 맞는다. 실제로 열어보고 조정하고, 모바일에서는 `min-h`가 이겨서 스크롤이 생기는 걸 허용한다.

### 선택: 서버 프리페치

첫 렌더 지연을 줄이고 싶으면 서버에서 먼저 받아 초기 데이터로 내려줄 수 있다. **다만 이 레포에는 하이드레이션 경계(TanStack Query)가 없으므로**, 서버 데이터를 `GraphView`의 `initialData` prop으로 넘기고 `useGetCrewGraph`가 그 값을 초기값으로 쓰도록 훅을 확장해야 한다 (`useGetDocumentLogs`가 `initialData`를 받는 선례가 있다).

그 경우 추가로 필요한 것:

```ts
// apis/server/graph.ts
'use server';

import type {CrewGraphResponse} from '@apis/generated/types';
import {CACHE} from '@constants/cache';
import {ENDPOINT} from '@constants/endpoint';
import {toQueryParams} from '@http/common';
import {requestGetServer} from '@http/server';

export const getCrewGraphServer = async (query: {generation: string; organizationDocumentUuid?: string}) => {
  try {
    return await requestGetServer<CrewGraphResponse>({
      baseUrl: process.env.NEXT_PUBLIC_BACKEND_SERVER_BASE_URL,
      endpoint: ENDPOINT.getCrewGraph,
      queryParams: toQueryParams(query),
      next: {
        revalidate: CACHE.time.basicRevalidate,
        tags: [CACHE.tag.getCrewGraph(query.generation)],
      },
    });
  } catch (error) {
    if (error instanceof Error) return null;
  }
};
```

```ts
// constants/cache.ts 에 태그 추가
getCrewGraph: (generation: string) => TAG_PREFIX + `graph:${generation}`,
```

문서를 새로 쓰거나 조직 연결을 바꾸면 그래프도 낡는다. 프리페치를 도입한다면 `app/api/post-document`, `app/api/put-document`, `app/api/put-organization-document` Route Handler에서 이 태그를 `revalidateTag`로 함께 무효화해야 한다. **프리페치를 안 하면 이 고민 자체가 없다** — 클라이언트 조회는 항상 최신이다. 그래서 1차 구현은 프리페치 없이 가는 걸 권장한다.

### 진입 경로 (파일 15, 선택)

`components/layout/Header/RightHeader.tsx`에 링크를 추가한다. 반드시 `route.goWikiGraph()`를 쓴다(`typedRoutes`).

---

## 15. 함정 모음

### 이 레포 / Next.js

| 증상 | 원인 | 해결 |
|---|---|---|
| `ssr: false is not allowed ... in Server Components` | Server Component에서 `dynamic(ssr:false)` | `'use client'` 파일(`GraphView.tsx`)에서만 호출 |
| `ReferenceError: window is not defined` | `react-force-graph-2d` 정적 import | `dynamic(ssr:false)` 뒤로 격리 |
| 빌드 시 `useSearchParams() should be wrapped in a suspense boundary` | Suspense 누락 | `page.tsx`에서 `<Suspense>` |
| `useRef` 인자 없음 타입 에러 | React 19는 `useRef`에 초기값이 필수 | `useRef<T \| undefined>(undefined)` |
| `router.push`/`replace`에서 타입 에러 | `next.config.ts`의 `typedRoutes: true` | `route.ts`에 이동 함수 추가 후 `as Route` |
| 매 렌더마다 API 재요청 | `useFetch`에 인라인 함수 전달 | `useCallback`으로 감싼다 |
| 응답이 `undefined` | `requestGetClient` 결과에서 `.data`를 또 꺼냄 | 래퍼가 이미 벗겨서 준다 |
| 캔버스 높이가 0 | 부모에 높이가 없음 / `width`,`height` prop 미지정 | `page.tsx`에서 명시적 높이 + `ResizeObserver` |
| `Module parse failed` / ESM interop | 번들러 트랜스파일 누락 | `next.config.ts`에 `transpilePackages: ['react-force-graph-2d']` |
| dev(Turbopack)에선 되는데 `yarn build`에서 깨짐 | 프로덕션 번들 차이 | `yarn build && yarn start`로 반드시 검증 |
| 라우트 이동 후 돌아오면 그래프 리셋 | 좌표 캐시 소실 | `useGetCrewGraph`의 언마운트 스냅샷 (구현됨) |

`transpilePackages`가 필요할 때만 넣는다. 기본 설정으로 빌드가 통과하면 건드리지 않는다.

```ts
// client/next.config.ts
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-force-graph-2d'],
  // ... 기존 설정 유지 (withSentryConfig 래핑도 그대로)
};
```

`reactStrictMode: true`가 켜져 있어 개발 모드에서 effect가 두 번 실행된다. `ResizeObserver` 등록/해제와 `d3Force` 주입이 2회 실행돼도 문제없게 정리(cleanup)를 빼먹지 말자.

### 라이브러리 공통

| 증상 | 원인 | 해결 |
|---|---|---|
| `Error: missing: <uuid>` | `nodes`에 없는 uuid를 참조하는 간선 | `buildIndex`에서 dangling edge 폐기 |
| 필터 변경 시 노드가 중앙에서 폭발 | 좌표 초기화 | `snapshotPositions` + `toGraphData(prev)` |
| 훅이 들고 있는 응답 객체가 오염됨 | 라이브러리가 배열·객체를 mutate | `toGraphData`에서 항상 새 객체 생성 |
| `link.source.title`이 undefined | 시뮬레이션 전에는 아직 문자열 | 항상 `linkEndId()`로 접근 |
| hover/클릭이 안 먹음 | `nodeCanvasObject`만 지정 | `nodePointerAreaPaint` 함께 지정 |
| 확대해도 라벨이 계속 커짐 | `globalScale`로 나누지 않음 | `fontSize = 10 / scale` |
| 시뮬레이션이 계속 재가열됨 | `graphData={{nodes, links}}` 인라인 | `useMemo` 결과를 넘긴다 |

---

## 16. 성능과 튜닝

### 규칙

1. **tick마다 React state를 갱신하지 않는다.** 좌표는 라이브러리가 노드 객체에 직접 심고 캔버스가 읽는다. `onNodeHover` 같은 저빈도 이벤트만 state로 올린다.
2. `graphData`에 객체 리터럴을 인라인으로 넘기지 않는다.
3. `paintNode`의 의존성 배열을 최소화한다 (hover / focus만).
4. 노드 500개를 넘기면 `cooldownTicks`를 60~80으로 낮추고 `warmupTicks`를 50으로 올려 초기 배치를 미리 계산한다.
5. 노드 2,000개를 넘기면 `react-force-graph-2d`의 한계다. `sigma.js + graphology`(WebGL) 교체를 검토한다.

### force 파라미터 튜닝표

`constants/graph.ts`의 `GRAPH_FORCE` 값을 바꾼다.

| 원하는 결과 | 조정 |
|---|---|
| 클러스터가 더 뭉치게 | `chargeStrength` -140 → -80 |
| 노드가 더 퍼지게 | `chargeStrength` -140 → -220 |
| 간선이 더 짧게 | `linkDistance` 58 → 40 |
| 전체가 화면 중앙에 모이게 | `centerStrength` 0.04 → 0.1 |
| 노드 겹침 제거 | `collidePadding` 5 → 10 |
| 빨리 안정화 | `d3AlphaDecay` 0.025 → 0.05 |
| 더 부드러운 움직임 | `d3VelocityDecay` 0.35 → 0.5 |

---

## 17. 접근성

- 캔버스와 동등한 정보를 담은 `sr-only` 링크 목록을 함께 렌더한다 (`CrewGraph.tsx`에 구현됨).
- 키보드 순회가 필요하면 그 목록에 포커스를 주고 `centerAt`을 연동한다.
- 색상만으로 간선 종류를 구분하지 않는다. 점선을 병행한다.
- `prefers-reduced-motion: reduce`이면 애니메이션 없이 최종 배치만 보여준다. `CrewGraph`는 클라이언트 전용이므로 `window` 접근이 안전하다.

```ts
const prefersReducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
// → warmupTicks={prefersReducedMotion ? 200 : 20} cooldownTicks={prefersReducedMotion ? 0 : 120}
```

---

## 18. 작업 순서

컨벤션 섹션 13의 "조회 기능(클라이언트)" 체크리스트를 그래프에 맞게 펼친 것이다.

```
1. curl 로 GET /graph 응답 확인               섹션 3
2. yarn add react-force-graph-2d d3-force     섹션 1
3. constants/endpoint.ts, urls.ts, route.ts   섹션 4
4. constants/graph.ts                          섹션 4
5. components/graph/type.ts                    섹션 5
6. utils/graph/buildIndex.ts                   섹션 6   ← 여기까지는 UI 없이 검증 가능
7. utils/graph/toGraphData.ts                  섹션 7
8. apis/client/graph.ts                        섹션 8
9. hooks/fetch/useGetCrewGraph.ts              섹션 9
10. app/wiki/graph/page.tsx (빈 화면)          섹션 14  ← 라우팅이 뜨는지 먼저 확인
11. components/graph/GraphView.tsx             섹션 11
12. components/graph/CrewGraph.tsx             섹션 12  ← 노드가 보이는 첫 순간
13. app/wiki/graph/useGraphParams.ts           섹션 10
14. components/graph/GraphControls.tsx         섹션 13
15. 헤더 진입 링크                              섹션 14
16. yarn lint && yarn typecheck && yarn build  섹션 19
```

6번까지 끝나면 UI 없이도 `buildIndex`/`localGraph`를 콘솔이나 임시 스크립트로 검증할 수 있다. 순수 함수라 여기서 버그를 잡아두면 캔버스 디버깅이 훨씬 쉬워진다. 12번에서 처음 노드가 보이는데, 이때 안 보이면 원인은 거의 항상 (a) 컨테이너 높이 0 (b) `nodes` 배열이 빈 값 (c) dangling edge 예외 셋 중 하나다.

---

## 19. 수용 기준

- [ ] `/wiki/graph?generation=1`로 접근하면 해당 기수의 크루 노드와 참조 간선이 렌더된다.
- [ ] `?generation=`이 없으면 `DEFAULT_GENERATION` 기수가 보이고, 기수 선택 UI에 `GENERATION_OPTIONS`가 렌더된다.
- [ ] URL에 `?org=<uuid>`를 손으로 붙이면 조직 노드가 추가되고 `ORGANIZATION_LINK` 간선이 점선으로 그려진다 (진입 UI는 범위 밖).
- [ ] 노드 반지름이 연결 수(degree)에 따라 커진다.
- [ ] 노드에 hover하면 자기 자신과 직접 이웃만 선명하고 나머지는 흐려진다.
- [ ] 노드를 클릭하면 URL의 `focus`가 갱신되고, 그 URL을 새 탭에 붙여넣으면 같은 화면이 나온다.
- [ ] 우클릭(또는 정한 제스처)으로 크루 문서는 `/wiki/{uuid}`, 조직 문서는 `/wiki/groups/{uuid}`로 이동한다.
- [ ] 기수를 바꿔도 공통 노드는 화면에서 튀지 않고 자연스럽게 재배치된다.
- [ ] 컨트롤을 조작해도 API 요청이 필요 이상으로(렌더마다) 발생하지 않는다 — 네트워크 탭으로 확인.
- [ ] 빈 그래프 / 로딩 / 에러 상태에 각각 안내 문구가 표시된다.
- [ ] 모바일(768px 이하)에서 컨트롤 패널이 캔버스를 가려 못 쓰게 되지 않는다.
- [ ] `yarn lint`, `yarn typecheck`가 통과한다.
- [ ] `yarn build && yarn start`가 경고 없이 통과하고 `window is not defined`가 발생하지 않는다.
- [ ] 노드 300개 기준 드래그/줌이 60fps를 유지한다.
- [ ] 커밋 시 lint-staged(prettier → eslint)가 통과한다.

> 이 레포에는 테스트 러너가 설정돼 있지 않다(`package.json`에 test 스크립트 없음). `buildIndex`/`localGraph`는 순수 함수라 테스트하기 좋은 대상이지만, 러너를 새로 도입할지는 별도 결정 사항이다. 도입 전까지는 중복 간선·self-loop·dangling edge·depth 0/1/2 케이스를 수동으로 확인한다.
