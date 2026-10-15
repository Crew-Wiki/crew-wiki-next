import {Ref} from 'react';
import {getEdgePath} from './getEdgePath';

type Point = {x: number; y: number};

interface GraphEdgeProps {
  ref: Ref<SVGPathElement>;
  source: Point;
  sourceInset: number;
  target: Point;
  targetInset: number;
  isReference?: boolean;
}

// 모든 간선은 굵기가 같다. 굵기는 이후 로드맵(관계 가중치)을 위해 아껴 둔 표현 수단이다.
const EDGE_STROKE_WIDTH = 1.5;

// 분야 간선은 소속을 뜻하는 실선, 참조 간선은 문서가 문서를 언급했다는 뜻의 점선이다.
// 분야 간선은 아주 옅다(기획안 demo.html 의 바탕 위 실제 색 #D8D8DC ≈ grayscale-200). 선은 소속을 알려 주는 배경이지 읽을 대상이 아니다 —
// 50명이 한 알약에 매달리면 선이 진할수록 이름이 묻힌다. 호버 단계에서 연결 간선만 진하게 올린다.
const EDGE_CLASS = {
  field: 'fill-none stroke-grayscale-200',
  reference: 'fill-none stroke-grayscale-700 opacity-50',
} as const;

const GraphEdge = ({ref, source, sourceInset, target, targetInset, isReference = false}: GraphEdgeProps) => (
  <path
    ref={ref}
    d={getEdgePath(source, sourceInset, target, targetInset)}
    strokeWidth={EDGE_STROKE_WIDTH}
    strokeDasharray={isReference ? '5 5' : undefined}
    className={isReference ? EDGE_CLASS.reference : EDGE_CLASS.field}
  />
);

export default GraphEdge;
