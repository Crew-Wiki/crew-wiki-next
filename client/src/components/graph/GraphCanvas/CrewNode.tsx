import {Ref} from 'react';
import {twMerge} from 'tailwind-merge';
import {CURRENT_GENERATION, GRAPH_CREW_LABEL_CLASS, GRAPH_FIELD_STYLE, GRAPH_NODE} from '@constants/graph';
import {GraphCrew} from '@type/Graph.type';
import {toNodeTransform} from './toNodeTransform';

interface CrewNodeProps {
  ref: Ref<SVGGElement>;
  crew: GraphCrew;
  x: number;
  y: number;
  isMultiGeneration: boolean;
  onActivate: (crew: GraphCrew) => void;
}

// 여러 기수를 함께 볼 때 이름 뒤에 붙는 기수 꼬리표. 이름보다 작고 흐리게 둬 읽는 순서를 이름 → 기수로 만든다.
const GENERATION_TAG = {
  fontSize: 10,
  gap: 4,
} as const;

// 크루 노드는 여러 겹이다 — 후광 → 투명한 히트 영역 → 점 → 라벨. 비율은 기획안 데모를 따랐다.
// 점은 기수에 따라 둘로 나뉜다. 지금 기수는 분야색으로 꽉 채우고, 지난 기수는 연하게 채우고 테두리로 형태만 세운다.
// 라벨은 분야와 무관하게 한 가지 색이다. 점이 이미 분야를 말하고 있어서 글자까지 물들이면 화면이 시끄럽다.
const CrewNode = ({ref, crew, x, y, isMultiGeneration, onActivate}: CrewNodeProps) => {
  const style = GRAPH_FIELD_STYLE[crew.field];
  const isCurrentGeneration = crew.generation === CURRENT_GENERATION;

  return (
    <g ref={ref} transform={toNodeTransform({x, y})} className="group cursor-pointer" onClick={() => onActivate(crew)}>
      <circle
        r={GRAPH_NODE.crewHaloRadius}
        strokeWidth={GRAPH_NODE.crewHaloWidth}
        className={twMerge(
          'fill-none opacity-0 transition-opacity duration-150 group-hover:opacity-[0.16]',
          style.halo,
        )}
      />
      <circle r={GRAPH_NODE.crewHitRadius} className="fill-transparent" />
      <circle
        r={GRAPH_NODE.crewRadius}
        strokeWidth={isCurrentGeneration ? 0 : GRAPH_NODE.pastGenerationStrokeWidth}
        className={isCurrentGeneration ? style.dot : style.pastDot}
      />
      <text
        y={GRAPH_NODE.crewLabelOffsetY}
        textAnchor="middle"
        fontSize={GRAPH_NODE.crewLabelFontSize}
        fontWeight={600}
        letterSpacing="-0.01em"
        className={twMerge('pointer-events-none select-none', GRAPH_CREW_LABEL_CLASS)}
      >
        {crew.label}
        {isMultiGeneration && (
          <tspan
            dx={GENERATION_TAG.gap}
            fontSize={GENERATION_TAG.fontSize}
            fontWeight={500}
            className="fill-grayscale-500"
          >
            {crew.generation}
          </tspan>
        )}
      </text>
    </g>
  );
};

export default CrewNode;
