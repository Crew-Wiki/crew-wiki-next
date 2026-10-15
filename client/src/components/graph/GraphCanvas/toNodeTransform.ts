type NodePose = {x: number; y: number; scale?: number};

// 노드 <g> 의 transform 속성. 처음 그릴 때(React)와 매 프레임 움직일 때(애니메이션 루프)가 같은 형식을 쓴다.
// 등장 중인 노드만 scale 이 붙는다. 다 자란 노드는 translate 만 남겨 정적 마크업을 깨끗하게 둔다.
export const toNodeTransform = ({x, y, scale = 1}: NodePose): string => {
  const translate = `translate(${x.toFixed(1)} ${y.toFixed(1)})`;

  return scale === 1 ? translate : `${translate} scale(${scale.toFixed(3)})`;
};
