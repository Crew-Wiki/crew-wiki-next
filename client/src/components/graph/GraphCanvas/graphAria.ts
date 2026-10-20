import {GRAPH_FIELDS} from '@constants/graph';
import {FieldId, GraphCrew, GraphField} from '@type/Graph.type';

const FIELD_NAME_BY_ID: Record<FieldId, string> = Object.fromEntries(
  GRAPH_FIELDS.map(field => [field.id, field.name]),
) as Record<FieldId, string>;

// 스크린리더가 읽는 이름. 보이는 글자(이름·인원수)는 aria-hidden 으로 가리고 이 한 줄로 대신한다 —
// 그래야 "Backend 4" 처럼 숫자만 덜렁 읽히지 않고, 무엇을 하는 버튼인지까지 전해진다. 문구는 기획안 데모(build.html)를 따랐다.
export const toFieldPillLabel = (field: GraphField): string =>
  `분야 ${field.name} ${field.crewCount}명, 필터 켜고 끄기`;

export const toCrewNodeLabel = (crew: GraphCrew): string =>
  `크루 ${crew.label} ${crew.generation} ${FIELD_NAME_BY_ID[crew.field]}, 문서로 이동`;

// 눌린 알약(aria-pressed) 표시: 알약 바깥에 띄운 가는 테두리. 포커스 테두리(알약 자체의 굵은 테두리)와 겹쳐도 서로 구분된다.
export const PRESSED_RING = {
  gap: 3,
  strokeWidth: 2,
} as const;
