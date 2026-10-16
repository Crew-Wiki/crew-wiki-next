import {useMemo, useState} from 'react';
import {GRAPH_LAYOUT} from '@constants/graph';
import useAmplitude from '@hooks/useAmplitude';
import {GraphCanvasProps, GraphCrew} from '@type/Graph.type';
import {calculateGraphLayout, crewNodeKey, fieldNodeKey} from '@utils/calculateGraphLayout';
import CrewNode from './CrewNode';
import FieldPill from './FieldPill';
import GraphEdge from './GraphEdge';
import {CREW_EDGE_INSET, FIELD_PILL_EDGE_INSET} from './getEdgePath';
import {fieldEdgeKey, getGraphHighlight, referenceEdgeKey} from './graphHover';
import {useGraphMotion} from './useGraphMotion';

interface GraphStageProps extends GraphCanvasProps {
  // 그래프가 놓인 자리의 실제 너비. GraphCanvas 가 재서 넘긴다.
  stageWidth: number;
}

// 배치 함수가 낸 좌표를 SVG 로 그린다. 데이터를 스스로 불러오지 않는다 —
// 어떤 기수·분야를 보여줄지는 데이터·조작 쪽이 정해서 crews · fields 로 넘기고, 여기서는 받은 것을 그리기만 한다.
//
// 레이어는 세 겹이다: 분야 간선 → 참조 간선 → 노드. SVG 는 뒤에 그린 것이 위에 올라오므로 노드가 항상 선 위에 있다.
// crews · fields 가 바뀌면 배치 함수가 새 목표 좌표를 내고, 노드는 스프링(useGraphMotion)으로 거기까지 이동한다.
// 새로 들어온 크루는 소속 알약 자리에서 태어나 퍼져 나간다.
// 노드를 호버하면 그 노드와 이웃만 남기고 나머지를 흐린다(graphHover).
// 크루를 누르면 계측 이벤트를 남기고 onCrewActivate 로 넘긴다. 문서로 이동하는 일은 데이터·조작 쪽 몫이다.
// 자리가 좁으면(stageWidth < narrowBreakpoint) 네 그룹을 세로로 쌓는다. 창을 늘였다 줄이면 두 배치 사이를 스프링으로 오간다.
const GraphStage = ({
  crews,
  fields,
  references,
  showReferences,
  isMultiGeneration,
  onCrewActivate,
  onFieldToggle,
  stageWidth,
}: GraphStageProps) => {
  const isNarrow = stageWidth < GRAPH_LAYOUT.narrowBreakpoint;

  const {trackGraphCrewClick} = useAmplitude();
  // 계측은 여기서 한 번만 남긴다. 호출자가 onCrewActivate 안에서 무엇을 하든(이동, 미리보기) 클릭 자체는 한 건이다.
  const handleCrewActivate = (crew: GraphCrew) => {
    trackGraphCrewClick(crew.title, crew.documentUuid, crew.field);
    onCrewActivate(crew);
  };

  const layout = useMemo(
    () => calculateGraphLayout({crews, fields, isMultiGeneration, isNarrow}),
    [crews, fields, isMultiGeneration, isNarrow],
  );
  // 새 크루 노드는 소속 알약 자리에서 태어나 제자리로 퍼져 나간다. 그 출발점을 키로 알려 준다.
  const spawnAnchors = useMemo(
    () => Object.fromEntries(crews.map(crew => [crewNodeKey(crew.documentUuid), fieldNodeKey(crew.field)])),
    [crews],
  );
  const {svgRef, viewBoxAttribute, getPosition, getNodeRef, getEdgeRef} = useGraphMotion({
    layout,
    spawnAnchors,
    stageWidth,
    isNarrow,
  });

  // 참조 간선은 크루 id 로 양 끝을 가리키므로, 그걸 배치 키로 바꾸는 표가 필요하다.
  const crewKeyById = useMemo(() => new Map(crews.map(crew => [crew.id, crewNodeKey(crew.documentUuid)])), [crews]);

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  // 호버하던 노드가 배치에서 사라지면(알약을 눌러 분야를 끄는 등) pointerleave 가 오지 않는다. 렌더 중에 바로 지운다.
  if (hoveredKey !== null && !layout[hoveredKey]) {
    setHoveredKey(null);
  }
  const handleHoverChange = (key: string, isHovering: boolean) => {
    if (isHovering) {
      setHoveredKey(key);
    } else {
      setHoveredKey(current => (current === key ? null : current));
    }
  };
  const {isHovering, litNodeKeys, litEdgeKeys} = getGraphHighlight({
    hoveredKey: hoveredKey !== null && layout[hoveredKey] ? hoveredKey : null,
    crews,
    references,
    showReferences,
    crewKeyById,
  });

  return (
    <svg ref={svgRef} viewBox={viewBoxAttribute} className="block h-auto w-full">
      <g>
        {crews.map(crew => {
          const sourceKey = fieldNodeKey(crew.field);
          const targetKey = crewNodeKey(crew.documentUuid);
          const source = getPosition(sourceKey);
          const target = getPosition(targetKey);
          // 배치 결과에 없는 노드(크루가 0명이라 레이아웃이 비었을 때 등)는 그리지 않는다.
          if (!source || !target) return null;

          const edgeKey = fieldEdgeKey(targetKey);

          return (
            <GraphEdge
              key={edgeKey}
              ref={getEdgeRef(edgeKey, {
                sourceKey,
                targetKey,
                sourceInset: FIELD_PILL_EDGE_INSET,
                targetInset: CREW_EDGE_INSET,
              })}
              source={source}
              sourceInset={FIELD_PILL_EDGE_INSET}
              target={target}
              targetInset={CREW_EDGE_INSET}
              isLit={litEdgeKeys.has(edgeKey)}
              isDimmed={isHovering && !litEdgeKeys.has(edgeKey)}
            />
          );
        })}
      </g>

      <g>
        {showReferences &&
          references.map(reference => {
            const sourceKey = crewKeyById.get(reference.sourceCrewId);
            const targetKey = crewKeyById.get(reference.targetCrewId);
            const source = sourceKey && getPosition(sourceKey);
            const target = targetKey && getPosition(targetKey);
            if (!sourceKey || !targetKey || !source || !target) return null;

            const edgeKey = referenceEdgeKey(sourceKey, targetKey);

            return (
              <GraphEdge
                key={edgeKey}
                ref={getEdgeRef(edgeKey, {
                  sourceKey,
                  targetKey,
                  sourceInset: CREW_EDGE_INSET,
                  targetInset: CREW_EDGE_INSET,
                })}
                source={source}
                sourceInset={CREW_EDGE_INSET}
                target={target}
                targetInset={CREW_EDGE_INSET}
                isReference
                isLit={litEdgeKeys.has(edgeKey)}
                isDimmed={isHovering && !litEdgeKeys.has(edgeKey)}
              />
            );
          })}
      </g>

      <g>
        {fields.map(field => {
          const key = fieldNodeKey(field.id);
          const position = getPosition(key);
          if (!position) return null;

          return (
            <FieldPill
              key={key}
              ref={getNodeRef(key)}
              field={field}
              x={position.x}
              y={position.y}
              scale={position.scale}
              isDimmed={isHovering && !litNodeKeys.has(key)}
              onToggle={onFieldToggle}
              onHoverChange={isNodeHovered => handleHoverChange(key, isNodeHovered)}
            />
          );
        })}
        {crews.map(crew => {
          const key = crewNodeKey(crew.documentUuid);
          const position = getPosition(key);
          if (!position) return null;

          return (
            <CrewNode
              key={key}
              ref={getNodeRef(key)}
              crew={crew}
              x={position.x}
              y={position.y}
              scale={position.scale}
              isMultiGeneration={isMultiGeneration}
              isDimmed={isHovering && !litNodeKeys.has(key)}
              onActivate={handleCrewActivate}
              onHoverChange={isNodeHovered => handleHoverChange(key, isNodeHovered)}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default GraphStage;
