import {GRAPH_NODE} from '@constants/graph';

type Point = {x: number; y: number};

// 간선은 두 노드의 중심을 잇되, 양 끝을 노드 크기만큼 안쪽으로 잘라 선이 노드에 닿지 않게 띄운다.
// 알약은 반지름(폭의 절반 59)을 그대로 쓰면 세로 방향에서 알약 높이(21)보다 훨씬 바깥에서 선이 시작돼 끊겨 보인다.
// 그래서 상한(27)을 두고, 가로 방향에서 알약 안쪽으로 들어가는 부분은 노드 레이어가 위에 그려져 가려진다.
export const FIELD_PILL_EDGE_INSET =
  Math.min(GRAPH_NODE.fieldPillWidth / 2, GRAPH_NODE.fieldPillEdgeClamp) + GRAPH_NODE.edgeGap;
export const CREW_EDGE_INSET = GRAPH_NODE.crewRadius + GRAPH_NODE.edgeGap;

export const getEdgePath = (source: Point, sourceInset: number, target: Point, targetInset: number): string => {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.hypot(dx, dy) || 1;
  const unitX = dx / distance;
  const unitY = dy / distance;

  const startX = source.x + unitX * sourceInset;
  const startY = source.y + unitY * sourceInset;
  const endX = target.x - unitX * targetInset;
  const endY = target.y - unitY * targetInset;

  return `M${startX.toFixed(1)} ${startY.toFixed(1)} L${endX.toFixed(1)} ${endY.toFixed(1)}`;
};
