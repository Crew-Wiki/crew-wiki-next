import {useCallback, useEffect, useRef} from 'react';
import {GRAPH_MOTION} from '@constants/graph';
import {GraphLayout, GraphViewBox} from '@type/Graph.type';
import {fitGraphViewBox} from '@utils/calculateGraphLayout';
import {getEdgePath} from './getEdgePath';
import {toNodeTransform} from './toNodeTransform';

interface NodeMotion {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface EdgeSpec {
  sourceKey: string;
  targetKey: string;
  sourceInset: number;
  targetInset: number;
}

interface UseGraphMotionParams {
  layout: GraphLayout;
  stageWidth: number;
  isNarrow: boolean;
}

type NodeRefCallback = (element: SVGGElement | null) => void;
type EdgeRefCallback = (element: SVGPathElement | null) => void;

const toViewBoxAttribute = ({x, y, width, height}: GraphViewBox) =>
  `${x.toFixed(1)} ${y.toFixed(1)} ${width.toFixed(1)} ${height.toFixed(1)}`;

// 배치 함수가 낸 목표 좌표와 화면에 보이는 현재 좌표를 분리한다. 목표가 바뀌면 현재 좌표가 스프링으로 따라간다.
//
// 현재 좌표는 React 상태가 아니라 ref 에 두고, rAF 루프가 노드의 transform · 간선의 d · svg 의 viewBox 를 직접 고친다.
// 매 프레임 노드 수십 개를 리렌더하면 그 비용이 애니메이션보다 크기 때문이다.
// React 는 노드가 생기고 없어질 때만 렌더하고, 그때는 ref 의 현재 좌표를 읽어 그리므로 그림이 튀지 않는다.
export const useGraphMotion = ({layout, stageWidth, isNarrow}: UseGraphMotionParams) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const positionsRef = useRef(new Map<string, NodeMotion>());
  const targetsRef = useRef(layout);
  const viewBoxRef = useRef<{current: GraphViewBox; target: GraphViewBox} | null>(null);
  const nodeElementsRef = useRef(new Map<string, SVGGElement>());
  const nodeRefsRef = useRef(new Map<string, NodeRefCallback>());
  const edgesRef = useRef(new Map<string, EdgeSpec & {element: SVGPathElement}>());
  const edgeRefsRef = useRef(new Map<string, EdgeRefCallback>());
  const frameRef = useRef(0);

  if (viewBoxRef.current === null) {
    const initial = fitGraphViewBox(layout, stageWidth, isNarrow);
    viewBoxRef.current = {current: {...initial}, target: initial};
  }

  const tick = useCallback(() => {
    const {stiffness, damping, settleVelocity, viewBoxLerp, settleViewBox} = GRAPH_MOTION;
    const positions = positionsRef.current;
    const targets = targetsRef.current;
    let isMoving = false;

    positions.forEach((motion, key) => {
      const target = targets[key];
      if (!target) return;

      motion.vx = (motion.vx + (target.x - motion.x) * stiffness) * damping;
      motion.vy = (motion.vy + (target.y - motion.y) * stiffness) * damping;
      motion.x += motion.vx;
      motion.y += motion.vy;

      if (Math.abs(motion.vx) > settleVelocity || Math.abs(motion.vy) > settleVelocity) {
        isMoving = true;
      }
    });

    // 멈출 때는 목표에 정확히 맞춘다. 남은 오차가 작아도 간선 끝이 미세하게 어긋난 채 끝나지 않게.
    if (!isMoving) {
      positions.forEach((motion, key) => {
        const target = targets[key];
        if (!target) return;

        motion.x = target.x;
        motion.y = target.y;
        motion.vx = 0;
        motion.vy = 0;
      });
    }

    positions.forEach((motion, key) => {
      nodeElementsRef.current.get(key)?.setAttribute('transform', toNodeTransform(motion));
    });

    edgesRef.current.forEach(({element, sourceKey, targetKey, sourceInset, targetInset}) => {
      const source = positions.get(sourceKey);
      const target = positions.get(targetKey);
      if (!source || !target) return;

      element.setAttribute('d', getEdgePath(source, sourceInset, target, targetInset));
    });

    const viewBox = viewBoxRef.current;
    if (viewBox) {
      (['x', 'y', 'width', 'height'] as const).forEach(axis => {
        const delta = viewBox.target[axis] - viewBox.current[axis];

        if (Math.abs(delta) > settleViewBox) {
          viewBox.current[axis] += delta * viewBoxLerp;
          isMoving = true;
        } else {
          viewBox.current[axis] = viewBox.target[axis];
        }
      });
      svgRef.current?.setAttribute('viewBox', toViewBoxAttribute(viewBox.current));
    }

    frameRef.current = isMoving ? requestAnimationFrame(tick) : 0;
  }, []);

  useEffect(() => {
    targetsRef.current = layout;

    const viewBox = viewBoxRef.current;
    if (viewBox) {
      viewBox.target = fitGraphViewBox(layout, stageWidth, isNarrow);
    }

    const positions = positionsRef.current;
    // 처음 그릴 때는 움직여 올 출발점이 없다. 목표에 바로 놓고 뷰박스도 맞춰 둔다.
    const isFirstLayout = positions.size === 0;

    positions.forEach((_, key) => {
      if (!layout[key]) positions.delete(key);
    });
    Object.entries(layout).forEach(([key, target]) => {
      if (!positions.has(key)) positions.set(key, {x: target.x, y: target.y, vx: 0, vy: 0});
    });

    if (isFirstLayout && viewBox) {
      viewBox.current = {...viewBox.target};
    }

    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(tick);
    }
  }, [layout, stageWidth, isNarrow, tick]);

  useEffect(
    () => () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    },
    [],
  );

  // 렌더 시점의 좌표. 이미 움직이고 있는 노드는 현재 좌표, 처음 나타나는 노드는 목표 좌표에서 시작한다.
  // 새 배치에 없는 노드는 지난 좌표가 ref 에 남아 있어도 그리지 않는다 — ref 정리는 렌더 뒤 effect 에서 하기 때문이다.
  const getPosition = (key: string): {x: number; y: number} | undefined => {
    const target = layout[key];
    if (!target) return undefined;

    return positionsRef.current.get(key) ?? target;
  };

  // 콜백 ref 는 키별로 한 번만 만들어 재사용한다. 렌더마다 새로 만들면 React 가 매번 ref 를 떼었다 다시 붙인다.
  const getNodeRef = (key: string): NodeRefCallback => {
    const cached = nodeRefsRef.current.get(key);
    if (cached) return cached;

    const callback: NodeRefCallback = element => {
      if (element) {
        nodeElementsRef.current.set(key, element);
      } else {
        nodeElementsRef.current.delete(key);
        nodeRefsRef.current.delete(key);
      }
    };
    nodeRefsRef.current.set(key, callback);

    return callback;
  };

  const getEdgeRef = (key: string, spec: EdgeSpec): EdgeRefCallback => {
    const cached = edgeRefsRef.current.get(key);
    if (cached) return cached;

    const callback: EdgeRefCallback = element => {
      if (element) {
        edgesRef.current.set(key, {element, ...spec});
      } else {
        edgesRef.current.delete(key);
        edgeRefsRef.current.delete(key);
      }
    };
    edgeRefsRef.current.set(key, callback);

    return callback;
  };

  return {
    svgRef,
    viewBoxAttribute: toViewBoxAttribute(viewBoxRef.current.current),
    getPosition,
    getNodeRef,
    getEdgeRef,
  };
};
