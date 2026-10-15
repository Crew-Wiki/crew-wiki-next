import {Ref} from 'react';
import {GRAPH_FIELD_STYLE, GRAPH_NODE} from '@constants/graph';
import {FieldId, GraphField} from '@type/Graph.type';
import {toNodeTransform} from './toNodeTransform';

interface FieldPillProps {
  ref: Ref<SVGGElement>;
  field: GraphField;
  x: number;
  y: number;
  onToggle: (fieldId: FieldId) => void;
}

// 분야 알약. 그룹의 중심이면서 필터 스위치다 — 누르면 onFieldToggle 로 데이터·조작 쪽에 넘어간다.
// 크기는 인원수·이름 길이와 무관하게 고정이다. 크기를 가중치로 쓰는 것은 이후 로드맵을 위해 아껴 둔 표현 수단이다.
const FieldPill = ({ref, field, x, y, onToggle}: FieldPillProps) => {
  const style = GRAPH_FIELD_STYLE[field.id];

  return (
    <g ref={ref} transform={toNodeTransform({x, y})} className="cursor-pointer" onClick={() => onToggle(field.id)}>
      <rect
        x={-GRAPH_NODE.fieldPillWidth / 2}
        y={-GRAPH_NODE.fieldPillHeight / 2}
        width={GRAPH_NODE.fieldPillWidth}
        height={GRAPH_NODE.fieldPillHeight}
        rx={GRAPH_NODE.fieldPillRadius}
        className={style.pill}
      />
      {/* 이름과 인원수를 한 text 안에서 나눈다. 인원수는 작고 흐리게 붙어 따라간다. */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={GRAPH_NODE.fieldPillFontSize}
        fontWeight={700}
        className="pointer-events-none select-none fill-white"
      >
        {field.name}
        <tspan
          dx={GRAPH_NODE.fieldPillCountGap}
          fontSize={GRAPH_NODE.fieldPillCountFontSize}
          fontWeight={500}
          fillOpacity={0.75}
        >
          {field.crewCount}
        </tspan>
      </text>
    </g>
  );
};

export default FieldPill;
