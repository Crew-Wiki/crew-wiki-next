import {Ref} from 'react';
import {twMerge} from 'tailwind-merge';
import {GRAPH_FIELD_STYLE, GRAPH_NODE} from '@constants/graph';
import {FieldId, GraphField} from '@type/Graph.type';
import {DIMMED_PILL_SHAPE_CLASS, DIMMED_PILL_TEXT_CLASS, toHoverHandlers} from './graphHover';
import {PRESSED_RING, toFieldPillLabel} from './graphAria';
import {FOCUSABLE_GROUP_CLASS, FOCUS_RING_CLASS, toKeyboardButtonProps} from './graphKeyboard';
import {toNodeTransform} from './toNodeTransform';

interface FieldPillProps {
  ref: Ref<SVGGElement>;
  field: GraphField;
  x: number;
  y: number;
  // 등장 중이면 1 보다 작다
  scale: number;
  // 다른 노드를 호버 중이라 이 알약은 연결이 없어 흐려진 상태
  isDimmed: boolean;
  onToggle: (fieldId: FieldId) => void;
  onHoverChange: (isHovering: boolean) => void;
}

// 분야 알약. 그룹의 중심이면서 필터 스위치다 — 누르면 onFieldToggle 로 데이터·조작 쪽에 넘어간다.
// 크기는 인원수·이름 길이와 무관하게 고정이다. 크기를 가중치로 쓰는 것은 이후 로드맵을 위해 아껴 둔 표현 수단이다.
const FieldPill = ({ref, field, x, y, scale, isDimmed, onToggle, onHoverChange}: FieldPillProps) => {
  const style = GRAPH_FIELD_STYLE[field.id];

  return (
    <g
      ref={ref}
      transform={toNodeTransform({x, y, scale})}
      className={twMerge(FOCUSABLE_GROUP_CLASS, 'cursor-pointer')}
      aria-label={toFieldPillLabel(field)}
      aria-pressed={field.isSelected}
      onClick={() => onToggle(field.id)}
      {...toHoverHandlers(onHoverChange)}
      {...toKeyboardButtonProps(() => onToggle(field.id))}
    >
      {/* 필터로 켜진 분야는 알약 바깥에 가는 테두리를 띄운다. 데이터·조작 쪽이 isSelected 로 알려 준다. */}
      {field.isSelected && (
        <rect
          x={-GRAPH_NODE.fieldPillWidth / 2 - PRESSED_RING.gap}
          y={-GRAPH_NODE.fieldPillHeight / 2 - PRESSED_RING.gap}
          width={GRAPH_NODE.fieldPillWidth + PRESSED_RING.gap * 2}
          height={GRAPH_NODE.fieldPillHeight + PRESSED_RING.gap * 2}
          rx={GRAPH_NODE.fieldPillRadius + PRESSED_RING.gap}
          strokeWidth={PRESSED_RING.strokeWidth}
          className={twMerge(
            'fill-none stroke-grayscale-800 transition-opacity duration-150 motion-reduce:transition-none',
            isDimmed && DIMMED_PILL_SHAPE_CLASS,
          )}
        />
      )}
      <rect
        x={-GRAPH_NODE.fieldPillWidth / 2}
        y={-GRAPH_NODE.fieldPillHeight / 2}
        width={GRAPH_NODE.fieldPillWidth}
        height={GRAPH_NODE.fieldPillHeight}
        rx={GRAPH_NODE.fieldPillRadius}
        className={twMerge(
          style.pill,
          FOCUS_RING_CLASS,
          'transition-opacity duration-150 motion-reduce:transition-none',
          isDimmed && DIMMED_PILL_SHAPE_CLASS,
        )}
      />
      {/* 이름과 인원수를 한 text 안에서 나눈다. 인원수는 작고 흐리게 붙어 따라간다. 읽는 이름은 aria-label 이 대신한다. */}
      <text
        aria-hidden
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={GRAPH_NODE.fieldPillFontSize}
        fontWeight={700}
        className={twMerge(
          'pointer-events-none select-none fill-white transition-[fill,opacity] duration-150 motion-reduce:transition-none',
          isDimmed && DIMMED_PILL_TEXT_CLASS,
        )}
      >
        {field.name}
        {/* 흐려진 알약은 인원수를 감춘다. 감출 때 tspan 을 아예 빼야 이름이 알약 가운데로 돌아온다. */}
        {!isDimmed && (
          <tspan
            dx={GRAPH_NODE.fieldPillCountGap}
            fontSize={GRAPH_NODE.fieldPillCountFontSize}
            fontWeight={500}
            fillOpacity={0.75}
          >
            {field.crewCount}
          </tspan>
        )}
      </text>
    </g>
  );
};

export default FieldPill;
