'use client';

import {useMemo} from 'react';
import {GRAPH_STAGE} from '@constants/graph';
import {GraphCanvasProps} from '@type/Graph.type';
import {calculateGraphLayout, crewNodeKey, fieldNodeKey} from '@utils/calculateGraphLayout';
import CrewNode from './CrewNode';
import FieldPill from './FieldPill';
import GraphEdge from './GraphEdge';
import {CREW_EDGE_INSET, FIELD_PILL_EDGE_INSET} from './getEdgePath';
import {useGraphMotion} from './useGraphMotion';

// 배치 함수가 낸 좌표를 SVG 로 그린다. 데이터를 스스로 불러오지 않는다 —
// 어떤 기수·분야를 보여줄지는 데이터·조작 쪽이 정해서 crews · fields 로 넘기고, 여기서는 받은 것을 그리기만 한다.
//
// 레이어는 세 겹이다: 분야 간선 → 참조 간선 → 노드. SVG 는 뒤에 그린 것이 위에 올라오므로 노드가 항상 선 위에 있다.
// crews · fields 가 바뀌면 배치 함수가 새 목표 좌표를 내고, 노드는 스프링(useGraphMotion)으로 거기까지 이동한다.
// 새로 들어온 크루는 소속 알약 자리에서 태어나 퍼져 나간다.
// 좁은 화면 판정은 다음 단계에서 붙는다.
const GraphCanvas = ({
  crews,
  fields,
  references,
  showReferences,
  isMultiGeneration,
  onCrewActivate,
  onFieldToggle,
}: GraphCanvasProps) => {
  const isNarrow = false;
  const stageWidth = GRAPH_STAGE.width;

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
  const crewKeyById = new Map(crews.map(crew => [crew.id, crewNodeKey(crew.documentUuid)]));

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

          return (
            <GraphEdge
              key={targetKey}
              ref={getEdgeRef(targetKey, {
                sourceKey,
                targetKey,
                sourceInset: FIELD_PILL_EDGE_INSET,
                targetInset: CREW_EDGE_INSET,
              })}
              source={source}
              sourceInset={FIELD_PILL_EDGE_INSET}
              target={target}
              targetInset={CREW_EDGE_INSET}
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

            const edgeKey = `reference:${sourceKey}:${targetKey}`;

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
              onToggle={onFieldToggle}
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
              isMultiGeneration={isMultiGeneration}
              onActivate={onCrewActivate}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default GraphCanvas;
