import {Ref} from 'react';
import {twMerge} from 'tailwind-merge';
import {CURRENT_GENERATION, GRAPH_CREW_LABEL_CLASS, GRAPH_FIELD_STYLE, GRAPH_NODE} from '@constants/graph';
import {GraphCrew} from '@type/Graph.type';
import {DIMMED_NODE_CLASS, toHoverHandlers} from './graphHover';
import {toKeyboardButtonProps} from './graphKeyboard';
import {toNodeTransform} from './toNodeTransform';

interface CrewNodeProps {
  ref: Ref<SVGGElement>;
  crew: GraphCrew;
  x: number;
  y: number;
  // 등장 중이면 1 보다 작다
  scale: number;
  isMultiGeneration: boolean;
  // 다른 노드를 호버 중이라 이 노드는 연결이 없어 흐려진 상태
  isDimmed: boolean;
  onActivate: (crew: GraphCrew) => void;
  onHoverChange: (isHovering: boolean) => void;
}

// 여러 기수를 함께 볼 때 이름 뒤에 붙는 기수 꼬리표. 이름보다 작고 흐리게 둬 읽는 순서를 이름 → 기수로 만든다.
const GENERATION_TAG = {
  fontSize: 10,
  gap: 4,
} as const;

// 라벨 글자 둘레의 바탕색 테두리 두께. 캔버스 바탕(그래프 페이지의 흰 카드)과 같은 색이어야 간선만 끊기고 테두리는 보이지 않는다.
const LABEL_HALO_WIDTH = 3;

// 크루 노드는 여러 겹이다 — 후광 → 투명한 히트 영역 → 점 → 라벨. 비율은 기획안 데모를 따랐다.
// 점은 기수에 따라 둘로 나뉜다. 지금 기수는 분야색으로 꽉 채우고, 지난 기수는 연하게 채우고 테두리로 형태만 세운다.
// 라벨은 분야와 무관하게 한 가지 색이다. 점이 이미 분야를 말하고 있어서 글자까지 물들이면 화면이 시끄럽다.
// 라벨 글자에는 바탕색 테두리를 두른다(paint-order 로 테두리를 글자 밑에 깐다). 간선이 글자를 지나갈 때 글자 둘레만큼 선이 끊겨 보여 이름이 읽힌다.
const CrewNode = ({ref, crew, x, y, scale, isMultiGeneration, isDimmed, onActivate, onHoverChange}: CrewNodeProps) => {
  const style = GRAPH_FIELD_STYLE[crew.field];
  const isCurrentGeneration = crew.generation === CURRENT_GENERATION;

  return (
    <g
      ref={ref}
      transform={toNodeTransform({x, y, scale})}
      className={twMerge(
        'group cursor-pointer transition-opacity duration-150 motion-reduce:transition-none',
        isDimmed && DIMMED_NODE_CLASS,
      )}
      onClick={() => onActivate(crew)}
      {...toHoverHandlers(onHoverChange)}
      {...toKeyboardButtonProps(() => onActivate(crew))}
    >
      <circle
        r={GRAPH_NODE.crewHaloRadius}
        strokeWidth={GRAPH_NODE.crewHaloWidth}
        className={twMerge(
          'fill-none opacity-0 transition-opacity duration-150 group-hover:opacity-[0.16] motion-reduce:transition-none',
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
        paintOrder="stroke"
        strokeWidth={LABEL_HALO_WIDTH}
        strokeLinejoin="round"
        className={twMerge('pointer-events-none select-none stroke-white', GRAPH_CREW_LABEL_CLASS)}
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
