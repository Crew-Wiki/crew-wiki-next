import {PointerEvent} from 'react';
import {FIELD_ID} from '@constants/graph';
import {FieldId, GraphCrew, GraphReference} from '@type/Graph.type';
import {crewNodeKey, fieldNodeKey} from '@utils/calculateGraphLayout';

// 간선 키. 분야 간선은 크루마다 하나뿐이라 크루 키를 그대로 쓰고, 참조 간선은 양 끝을 이어 만든다.
export const fieldEdgeKey = (crewKey: string) => crewKey;
export const referenceEdgeKey = (sourceKey: string, targetKey: string) => `reference:${sourceKey}:${targetKey}`;

// 호버 중 연결되지 않은 것들을 흐리게 하는 정도. 이식 원본(build.html `.stage.hovering`)의 노드 .3, 간선 .25 를 따른다.
export const DIMMED_NODE_CLASS = 'opacity-30';
export const DIMMED_EDGE_CLASS = 'opacity-25';

// 흐려진 알약은 통째로 투명하게 하지 않는다 — 흰 글자가 옅어진 알약 위에서 같이 사라져 이름을 못 읽는다.
// demo.html(`.fhub:not(.lit)`)처럼 알약만 옅게(.22) 하고, 글자는 회색으로 바꾸고, 인원수는 감춘다.
export const DIMMED_PILL_SHAPE_CLASS = 'opacity-[0.22]';
export const DIMMED_PILL_TEXT_CLASS = 'fill-grayscale-500 opacity-60';

// 켜진 크루는 후광을 띄운다. 크루 하나를 가리키면 그 크루만, 알약을 가리키면 소속 크루 전부가 같은 후광을 받는다(demo.html `.crew.lit .chalo`).
export const LIT_CREW_HALO_CLASS = 'opacity-[0.16]';

// 켜진 간선은 조금 굵어지고(1.5 → 2) 색이 올라온다. 평소 간선이 아주 옅어서(grayscale-200) 굵기만으로는 눈에 띄지 않는다.
// 분야 간선은 그 분야의 점 색으로 — 기획안 데모(demo.html `.medge.lit.be{stroke:var(--be)}`)처럼 알약에서 같은 색 선이 뻗어 나간다.
// 미지정은 점 색(grayscale-400)이 흐려진 간선과 잘 구분되지 않아 알약 색(grayscale-600)을 쓴다. 참조 간선은 분야가 둘이라 글자색.
export const LIT_EDGE_CLASS = 'stroke-2 opacity-100';
export const LIT_FIELD_EDGE_STROKE_CLASS: Record<FieldId, string> = {
  [FIELD_ID.Backend]: 'stroke-backend-500',
  [FIELD_ID.Frontend]: 'stroke-frontend-500',
  [FIELD_ID.Android]: 'stroke-android-500',
  [FIELD_ID.Unassigned]: 'stroke-grayscale-600',
};
export const LIT_REFERENCE_EDGE_STROKE_CLASS = 'stroke-grayscale-800';

export interface GraphHighlight {
  // 호버 중인지. 아닐 때는 아무것도 흐리지 않는다.
  isHovering: boolean;
  litNodeKeys: Set<string>;
  litEdgeKeys: Set<string>;
}

interface GetGraphHighlightParams {
  hoveredKey: string | null;
  crews: GraphCrew[];
  references: GraphReference[];
  showReferences: boolean;
  // 참조 간선은 크루 id 로 양 끝을 가리키므로 배치 키로 바꾸는 표가 필요하다.
  crewKeyById: Map<string, string>;
}

// 호버된 노드와 그 이웃만 밝힌다. 크루를 가리키면 소속 알약(과 참조로 이어진 크루)이, 알약을 가리키면 소속 크루 전부가 함께 밝아진다.
// 간선은 호버된 노드에 닿은 것만 켠다.
export const getGraphHighlight = ({
  hoveredKey,
  crews,
  references,
  showReferences,
  crewKeyById,
}: GetGraphHighlightParams): GraphHighlight => {
  const litNodeKeys = new Set<string>();
  const litEdgeKeys = new Set<string>();

  if (hoveredKey === null) {
    return {isHovering: false, litNodeKeys, litEdgeKeys};
  }

  litNodeKeys.add(hoveredKey);

  crews.forEach(crew => {
    const crewKey = crewNodeKey(crew.documentUuid);
    const fieldKey = fieldNodeKey(crew.field);

    if (crewKey === hoveredKey) {
      litNodeKeys.add(fieldKey);
      litEdgeKeys.add(fieldEdgeKey(crewKey));
    } else if (fieldKey === hoveredKey) {
      litNodeKeys.add(crewKey);
      litEdgeKeys.add(fieldEdgeKey(crewKey));
    }
  });

  if (showReferences) {
    references.forEach(reference => {
      const sourceKey = crewKeyById.get(reference.sourceCrewId);
      const targetKey = crewKeyById.get(reference.targetCrewId);
      if (!sourceKey || !targetKey) return;

      if (sourceKey === hoveredKey) {
        litNodeKeys.add(targetKey);
        litEdgeKeys.add(referenceEdgeKey(sourceKey, targetKey));
      } else if (targetKey === hoveredKey) {
        litNodeKeys.add(sourceKey);
        litEdgeKeys.add(referenceEdgeKey(sourceKey, targetKey));
      }
    });
  }

  return {isHovering: true, litNodeKeys, litEdgeKeys};
};

// 노드 <g> 에 붙이는 호버 핸들러. 터치에는 호버가 없다 — 탭한 뒤 흐림이 풀리지 않고 남는 것을 막는다.
// 키보드 포커스도 호버와 같이 다룬다. Tab 으로 노드에 서면 그 노드와 이웃만 남고 나머지가 흐려진다(이식 원본 focusin → setHover).
export const toHoverHandlers = (onHoverChange: (isHovering: boolean) => void) => ({
  onPointerEnter: (event: PointerEvent<SVGGElement>) => {
    if (event.pointerType !== 'touch') onHoverChange(true);
  },
  onPointerLeave: () => onHoverChange(false),
  onFocus: () => onHoverChange(true),
  onBlur: () => onHoverChange(false),
});
