import {GRAPH_LAYOUT, GRAPH_NODE, GRAPH_STAGE} from '@constants/graph';
import {Generation, GraphCrew, GraphField, GraphLayout, GraphNodePosition, GraphViewBox} from '@type/Graph.type';

// 분야 알약을 중심에 둔 그룹을 화면에 배치하고, 그 안에 크루를 링으로 돌린 뒤,
// 겹친 노드를 밀어내 최종 좌표를 낸다. DOM·시간·뷰포트에 의존하지 않는 순수 함수다.
// 실제 이동은 이 함수가 아니라 렌더 루프의 스프링이 맡는다 — 여기서는 목표 좌표만 만든다.

type Point = {x: number; y: number};

type LayoutNode = GraphNodePosition & {key: string};

interface CalculateGraphLayoutParams {
  crews: GraphCrew[];
  fields: GraphField[];
  isMultiGeneration: boolean;
  isNarrow: boolean;
}

export const fieldNodeKey = (fieldId: string) => `field:${fieldId}`;
export const crewNodeKey = (documentUuid: string) => `crew:${documentUuid}`;

// '8기' → 8. 높은 기수가 링 안쪽에 오도록 정렬할 때 쓴다.
const generationOrder = (generation: Generation) => Number.parseInt(generation, 10);

// 좁은 화면에서 그룹이 차지하는 세로 반경. 인원이 많아지면 상한에서 멈춘다.
const narrowClusterRadius = (crewCount: number) =>
  crewCount > GRAPH_LAYOUT.narrowClusterThreshold
    ? GRAPH_LAYOUT.narrowClusterRadiusMax
    : GRAPH_LAYOUT.narrowClusterRadiusBase + crewCount * GRAPH_LAYOUT.narrowClusterRadiusStep;

// 좁은 화면은 그룹을 세로로 쌓는다. 그룹 개수에 무관하게 돌아가므로,
// 미지정이 fields 배열 마지막에 있기만 하면 자동으로 맨 아래 단이 된다.
const calculateNarrowAnchors = (crewCounts: number[]): Point[] => {
  const radii = crewCounts.map(narrowClusterRadius);
  const offsets: number[] = [];

  radii.forEach((radius, index) => {
    const previous = offsets[index - 1];
    offsets.push(index === 0 ? radius : previous + radii[index - 1] + radius + GRAPH_LAYOUT.narrowStackGap);
  });

  const middle = (offsets[0] + offsets[offsets.length - 1]) / 2;

  return offsets.map(offset => ({x: GRAPH_STAGE.centerX, y: GRAPH_STAGE.centerY + offset - middle}));
};

// 넓은 화면 앵커. 분야는 최대 4개(세 분야 + 미지정)이므로 그 이상은 다루지 않는다.
const calculateWideAnchors = (groupCount: number): Point[] => {
  const {centerX, centerY} = GRAPH_STAGE;

  if (groupCount === 1) {
    return [{x: centerX, y: centerY}];
  }

  if (groupCount === 2) {
    return [
      {x: centerX - GRAPH_LAYOUT.twoGroupOffsetX, y: centerY},
      {x: centerX + GRAPH_LAYOUT.twoGroupOffsetX, y: centerY},
    ];
  }

  // 위 1개 + 아래 좌우 2개의 삼각 배치
  const triangle = [0, 1, 2].map(index => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 3;

    return {
      x: centerX + Math.cos(angle) * GRAPH_LAYOUT.anchorRadiusX,
      y: centerY + Math.sin(angle) * GRAPH_LAYOUT.anchorRadiusY,
    };
  });

  if (groupCount === 3) {
    return triangle;
  }

  // 네 그룹이면 삼각 배치를 통째로 위로 밀고 미지정을 아래 중앙에 둔다.
  // 2π/4 로 균등 분할하면 미지정이 왼쪽에 놓여 '세 분야 아래쪽' 이라는 요구를 어긴다.
  return [
    ...triangle.map(point => ({x: point.x, y: point.y + GRAPH_LAYOUT.assignedShiftY})),
    {x: centerX, y: centerY + GRAPH_LAYOUT.unassignedOffsetY},
  ];
};

// 그룹 안에서 크루를 링에 돌린다. 인원이 많으면 안쪽·바깥쪽 두 링으로 쪼갠다.
const placeCrewsAroundAnchor = (
  crews: GraphCrew[],
  anchor: Point,
  isSingleGroup: boolean,
  isNarrow: boolean,
  isMultiGeneration: boolean,
): LayoutNode[] => {
  const sorted = [...crews].sort((a, b) => generationOrder(b.generation) - generationOrder(a.generation));

  // 그룹이 하나뿐이거나 세로 스택이면 원을 다 쓰고, 아니면 중심 반대쪽을 향해 부채꼴로 편다.
  const spreadsFullCircle = isSingleGroup || isNarrow;
  const baseAngle = spreadsFullCircle
    ? -Math.PI / 2
    : Math.atan2(anchor.y - GRAPH_STAGE.centerY, anchor.x - GRAPH_STAGE.centerX);
  const span = spreadsFullCircle ? Math.PI * 2 : GRAPH_LAYOUT.ringSpanWide;
  const ringLimit = isNarrow ? GRAPH_LAYOUT.ringLimitNarrow : GRAPH_LAYOUT.ringLimitWide;

  const splitIndex = Math.ceil(sorted.length * GRAPH_LAYOUT.ringSplitRatio);
  const rings = sorted.length <= ringLimit ? [sorted] : [sorted.slice(0, splitIndex), sorted.slice(splitIndex)];

  const ringRadius = (ringIndex: number) => {
    if (rings.length === 1) {
      return isNarrow
        ? GRAPH_LAYOUT.narrowClusterRadiusBase + sorted.length * GRAPH_LAYOUT.narrowClusterRadiusStep
        : GRAPH_LAYOUT.ringRadiusWideBase + sorted.length * GRAPH_LAYOUT.ringRadiusWideStep;
    }

    if (ringIndex === 0) {
      return isNarrow ? GRAPH_LAYOUT.ringRadiusNarrowInner : GRAPH_LAYOUT.ringRadiusWideInner;
    }

    return isNarrow ? GRAPH_LAYOUT.ringRadiusNarrowOuter : GRAPH_LAYOUT.ringRadiusWideOuter;
  };

  return rings.flatMap((ring, ringIndex) => {
    const radius = ringRadius(ringIndex);

    return ring.map((crew, index) => {
      const angle = baseAngle - span / 2 + ((index + 0.5) * span) / ring.length;

      return {
        key: crewNodeKey(crew.documentUuid),
        x: anchor.x + Math.cos(angle) * radius,
        y: anchor.y + Math.sin(angle) * radius,
        radius: GRAPH_NODE.crewRadius,
        isField: false,
        labelLength: crew.name.length + (isMultiGeneration ? GRAPH_LAYOUT.multiGenerationLabelPad : 0),
      };
    });
  });
};

// 겹친 노드를 밀어낸다. 라벨 폭은 세로로 가까운 쌍에만 적용한다 —
// 위아래로 떨어진 노드끼리는 라벨이 부딪히지 않으므로 그만큼 벌릴 이유가 없다.
const relaxOverlaps = (nodes: LayoutNode[], isMultiGeneration: boolean) => {
  const minGap = isMultiGeneration ? GRAPH_LAYOUT.minGapMultiGeneration : GRAPH_LAYOUT.minGapSingleGeneration;
  const labelWidth = (node: LayoutNode) =>
    node.isField ? 0 : GRAPH_LAYOUT.labelBaseWidth + node.labelLength * GRAPH_LAYOUT.labelCharWidth;

  const requiredGap = (a: LayoutNode, b: LayoutNode, verticalDistance: number) => {
    if (a.isField || b.isField) {
      return a.radius + b.radius + GRAPH_LAYOUT.pillClearance;
    }

    if (verticalDistance >= GRAPH_LAYOUT.labelRowThreshold) {
      return minGap;
    }

    return Math.max(minGap, (labelWidth(a) + labelWidth(b)) / 2 + GRAPH_LAYOUT.labelPadding);
  };

  for (let iteration = 0; iteration < GRAPH_LAYOUT.relaxIterations; iteration += 1) {
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy) || 0.01;
        const minDistance = requiredGap(a, b, Math.abs(dy));

        if (distance >= minDistance) {
          continue;
        }

        const push = ((minDistance - distance) / distance) * GRAPH_LAYOUT.pillRelaxPushRatio;
        const weightA = a.isField ? GRAPH_LAYOUT.pillRelaxWeight : 1;
        const weightB = b.isField ? GRAPH_LAYOUT.pillRelaxWeight : 1;

        a.x -= dx * push * weightA;
        a.y -= dy * push * weightA;
        b.x += dx * push * weightB;
        b.y += dy * push * weightB;
      }
    }
  }
};

export const calculateGraphLayout = ({
  crews,
  fields,
  isMultiGeneration,
  isNarrow,
}: CalculateGraphLayoutParams): GraphLayout => {
  if (fields.length === 0 || crews.length === 0) {
    return {};
  }

  const crewsByField = fields.map(field => crews.filter(crew => crew.field === field.id));
  const anchors = isNarrow
    ? calculateNarrowAnchors(crewsByField.map(group => group.length))
    : calculateWideAnchors(fields.length);

  const nodes: LayoutNode[] = fields.flatMap((field, index) => {
    const anchor = anchors[index];

    const fieldNode: LayoutNode = {
      key: fieldNodeKey(field.id),
      x: anchor.x,
      y: anchor.y,
      radius: GRAPH_NODE.fieldPillWidth / 2,
      isField: true,
      labelLength: field.name.length,
    };

    const crewNodes = placeCrewsAroundAnchor(
      crewsByField[index],
      anchor,
      fields.length === 1,
      isNarrow,
      isMultiGeneration,
    );

    return [fieldNode, ...crewNodes];
  });

  relaxOverlaps(nodes, isMultiGeneration);

  return Object.fromEntries(nodes.map(({key, ...position}) => [key, position]));
};

// 배치 결과를 감싸는 viewBox. 내용이 무대보다 크면 그만큼 축소한다.
export const fitGraphViewBox = (layout: GraphLayout, stageWidth: number, isNarrow: boolean): GraphViewBox => {
  const positions = Object.values(layout);

  if (positions.length === 0) {
    return {x: 0, y: 0, width: GRAPH_STAGE.width, height: GRAPH_STAGE.height};
  }

  const bounds = positions.reduce(
    (acc, node) => {
      const halfWidth = node.isField ? node.radius : GRAPH_LAYOUT.fitCrewBoundsX;
      const top = node.isField ? GRAPH_NODE.fieldPillHeight / 2 : GRAPH_LAYOUT.fitCrewBoundsTop;
      const bottom = node.isField ? GRAPH_NODE.fieldPillHeight / 2 : GRAPH_LAYOUT.fitCrewBoundsBottom;

      return {
        left: Math.min(acc.left, node.x - halfWidth),
        right: Math.max(acc.right, node.x + halfWidth),
        top: Math.min(acc.top, node.y - top),
        bottom: Math.max(acc.bottom, node.y + bottom),
      };
    },
    {left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity},
  );

  const padding = GRAPH_LAYOUT.fitPadding;
  const contentWidth = bounds.right - bounds.left + padding * 2;
  const contentHeight = bounds.bottom - bounds.top + padding * 2;
  const centerX = (bounds.left + bounds.right) / 2;
  const centerY = (bounds.top + bounds.bottom) / 2;

  const stageHeight = isNarrow
    ? Math.min(GRAPH_LAYOUT.fitHeightNarrowMax, Math.max(GRAPH_LAYOUT.fitHeightNarrowMin, contentHeight))
    : Math.min(
        GRAPH_LAYOUT.fitHeightWideMax,
        Math.max(GRAPH_LAYOUT.fitHeightWideMin, stageWidth * GRAPH_LAYOUT.fitHeightWideRatio),
      );

  const scale = Math.max(1, contentWidth / stageWidth, contentHeight / stageHeight);

  return {
    x: centerX - (stageWidth * scale) / 2,
    y: centerY - (stageHeight * scale) / 2,
    width: stageWidth * scale,
    height: stageHeight * scale,
  };
};
