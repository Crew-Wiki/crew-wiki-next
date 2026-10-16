import {PointerEvent} from 'react';
import {GraphCrew, GraphReference} from '@type/Graph.type';
import {crewNodeKey, fieldNodeKey} from '@utils/calculateGraphLayout';

// 간선 키. 분야 간선은 크루마다 하나뿐이라 크루 키를 그대로 쓰고, 참조 간선은 양 끝을 이어 만든다.
export const fieldEdgeKey = (crewKey: string) => crewKey;
export const referenceEdgeKey = (sourceKey: string, targetKey: string) => `reference:${sourceKey}:${targetKey}`;

// 호버 중 연결되지 않은 것들을 흐리게 하는 정도. 이식 원본(build.html `.stage.hovering`)의 노드 .3, 간선 .25 를 따른다.
// 켜진 간선은 글자색으로 올린다. 평소 간선이 아주 옅어서(grayscale-200) 굵기만 바꿔서는 눈에 띄지 않는다.
export const DIMMED_NODE_CLASS = 'opacity-30';
export const DIMMED_EDGE_CLASS = 'opacity-25';
export const LIT_EDGE_CLASS = 'stroke-grayscale-800 opacity-100';

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
