import {CREW_FIELD, FIELD_ID, GENERATIONS} from '@constants/graph';
import {DocumentType} from './Document.type';

export type FieldId = (typeof FIELD_ID)[keyof typeof FIELD_ID];
export type CrewField = (typeof CREW_FIELD)[keyof typeof CREW_FIELD];
export type Generation = (typeof GENERATIONS)[number];

/* ---------- API 응답 (정제 전) ---------- */
// requestGetServer 가 {data, code} 래퍼를 벗겨 data 만 돌려주므로 여기에는 본문 타입만 둔다.

// GET /document/crews?generation=
export interface GenerationCrewResponse {
  name: string;
  documentUuid: string;
  // Swagger enum 에는 null 이 없지만 실제로는 분야를 입력하지 않은 크루가 null 로 내려온다.
  // 2026-08-25 기준 8기 34명 중 25명이 null 이고, 이들이 '미지정' 그룹이 된다.
  field: CrewField | null;
}

export const GRAPH_EDGE_TYPE = {
  Reference: 'REFERENCE',
  OrganizationLink: 'ORGANIZATION_LINK',
} as const;

export type GraphEdgeType = (typeof GRAPH_EDGE_TYPE)[keyof typeof GRAPH_EDGE_TYPE];

// GET /graph?generation=&organizationDocumentUuid=
// 노드의 type 은 기존 DocumentType('CREW' | 'ORGANIZATION')과 값이 같아 그대로 쓴다.
export interface GraphNodeResponse {
  documentUuid: string;
  title: string;
  type: DocumentType;
}

export interface GraphEdgeResponse {
  sourceDocumentUuid: string;
  targetDocumentUuid: string;
  type: GraphEdgeType;
}

// 분야 노드는 응답에 없다. 크루의 field 값으로 프론트가 합성한다.
export interface CrewGraphResponse {
  nodes: GraphNodeResponse[];
  edges: GraphEdgeResponse[];
}

/* ---------- 그래프 내부 모델 (정제 후 · 데이터·조작이 만들어 그래프에 넘긴다) ---------- */

export interface GraphCrew {
  id: string; // `crew:${documentUuid}`
  title: string; // 문서 제목 원문. 예: '카야(8기)'
  // 화면에 그릴 라벨. 제목에서 기수를 뗀 값이다 (toGraphLabel).
  // 같은 라벨이 둘 이상 나올 수 있다 — '루나(8기)' 와 '루나' 는 라벨이 같아도 다른 문서다.
  // 노드를 구분하는 것은 라벨이 아니라 documentUuid 다.
  label: string;
  documentUuid: string;
  documentType: DocumentType;
  field: FieldId; // 응답의 null 은 여기서 'unassigned' 로 접힌다
  generation: Generation;
}

export interface GraphField {
  id: FieldId;
  name: string;
  crewCount: number;
  isSelected: boolean; // 분야 노드의 aria-pressed 와 연결된다
}

export interface GraphReference {
  sourceCrewId: string;
  targetCrewId: string;
}

/* ---------- 배치 결과 ---------- */

export interface GraphNodePosition {
  x: number;
  y: number;
  radius: number;
  isField: boolean; // 분야 알약은 반발 완화에서 거의 밀리지 않는다
  labelLength: number; // 라벨 폭을 계산해 같은 줄 노드끼리 간격을 확보한다
}

// key 는 `field:${FieldId}` 또는 `crew:${documentUuid}`
export type GraphLayout = Record<string, GraphNodePosition>;

export interface GraphViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/* ---------- 그래프가 받는 props ---------- */
// 그래프는 데이터를 스스로 불러오지 않는다. 필터가 이미 적용된 결과만 받아 그린다.
// 머지 뒤에는 동결한다 — 바꿔야 하면 그래프와 데이터·조작 담당이 같이 한 커밋으로 처리한다.

export interface GraphCanvasProps {
  crews: GraphCrew[];
  fields: GraphField[];
  references: GraphReference[]; // 참조 간선은 MVP 에서 끄므로 당분간 항상 빈 배열
  showReferences: boolean;
  isMultiGeneration: boolean; // 여러 기수를 함께 보면 라벨에 기수를 병기한다
  onCrewActivate: (crew: GraphCrew) => void; // 문서 이동은 데이터·조작 쪽이 구현한다
  onFieldToggle: (fieldId: FieldId) => void; // 두 영역의 경계를 넘는 유일한 지점
}
