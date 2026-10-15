'use client';

import {GRAPH_STAGE} from '@constants/graph';
import {GraphCanvasProps, GraphNodePosition} from '@type/Graph.type';
import {calculateGraphLayout, crewNodeKey, fieldNodeKey, fitGraphViewBox} from '@utils/calculateGraphLayout';
import CrewNode from './CrewNode';
import FieldPill from './FieldPill';
import GraphEdge from './GraphEdge';
import {CREW_EDGE_INSET, FIELD_PILL_EDGE_INSET} from './getEdgePath';

// 배치 함수가 낸 좌표를 SVG 로 그린다. 데이터를 스스로 불러오지 않는다 —
// 어떤 기수·분야를 보여줄지는 데이터·조작 쪽이 정해서 crews · fields 로 넘기고, 여기서는 받은 것을 그리기만 한다.
//
// 레이어는 세 겹이다: 분야 간선 → 참조 간선 → 노드. SVG 는 뒤에 그린 것이 위에 올라오므로 노드가 항상 선 위에 있다.
// 지금은 노드를 목표 좌표에 바로 놓는다. 좌표 사이를 잇는 스프링 이동과 좁은 화면 판정은 다음 단계에서 이 위에 붙는다.
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
  const layout = calculateGraphLayout({crews, fields, isMultiGeneration, isNarrow});
  const viewBox = fitGraphViewBox(layout, GRAPH_STAGE.width, isNarrow);

  // 배치 결과에 없는 노드(크루가 0명이라 레이아웃이 비었을 때 등)는 그리지 않는다.
  const fieldPositions = new Map<string, GraphNodePosition>();
  fields.forEach(field => {
    const position = layout[fieldNodeKey(field.id)];
    if (position) fieldPositions.set(field.id, position);
  });

  const crewPositions = new Map<string, GraphNodePosition>();
  crews.forEach(crew => {
    const position = layout[crewNodeKey(crew.documentUuid)];
    if (position) crewPositions.set(crew.id, position);
  });

  return (
    <svg viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} className="block h-auto w-full">
      <g>
        {crews.map(crew => {
          const source = fieldPositions.get(crew.field);
          const target = crewPositions.get(crew.id);
          if (!source || !target) return null;

          return (
            <GraphEdge
              key={crew.id}
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
            const source = crewPositions.get(reference.sourceCrewId);
            const target = crewPositions.get(reference.targetCrewId);
            if (!source || !target) return null;

            return (
              <GraphEdge
                key={`${reference.sourceCrewId}-${reference.targetCrewId}`}
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
          const position = fieldPositions.get(field.id);
          if (!position) return null;

          return <FieldPill key={field.id} field={field} x={position.x} y={position.y} onToggle={onFieldToggle} />;
        })}
        {crews.map(crew => {
          const position = crewPositions.get(crew.id);
          if (!position) return null;

          return (
            <CrewNode
              key={crew.id}
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
