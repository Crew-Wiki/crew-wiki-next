'use client';

import {GraphCanvasProps} from '@type/Graph.type';
import GraphStage from './GraphStage';
import {useStageWidth} from './useStageWidth';

// 그래프가 놓인 자리의 너비를 재서 GraphStage 에 넘긴다. 그리는 일은 전부 GraphStage 가 한다.
//
// 너비를 알기 전에는 아무것도 그리지 않는다. 첫 배치는 제자리에 바로 놓이고 그 뒤의 변화만 스프링으로 움직이는데,
// 너비를 모른 채 넓은 배치로 먼저 그리면 좁은 화면에서는 그 그림이 세로 스택으로 접히는 움직임이 첫인상이 된다.
// 재는 일은 레이아웃 effect 에서 하므로 빈 프레임이 화면에 나가지는 않는다. 서버 렌더 결과에는 그래프가 없다.
const GraphCanvas = (props: GraphCanvasProps) => {
  const {containerRef, stageWidth} = useStageWidth();

  return (
    <div ref={containerRef} className="w-full">
      {stageWidth !== null && <GraphStage {...props} stageWidth={stageWidth} />}
    </div>
  );
};

export default GraphCanvas;
