type NodePose = {x: number; y: number};

// 노드 <g> 의 transform 속성. 처음 그릴 때(React)와 매 프레임 움직일 때(애니메이션 루프)가 같은 형식을 쓴다.
export const toNodeTransform = ({x, y}: NodePose): string => `translate(${x.toFixed(1)} ${y.toFixed(1)})`;
