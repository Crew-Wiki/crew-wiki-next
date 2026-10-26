import {KeyboardEvent} from 'react';
import {GraphCrew, GraphLayout} from '@type/Graph.type';
import {crewNodeKey} from '@utils/calculateGraphLayout';

// 포커스 표시. 브라우저 기본 outline 은 <g> 의 사각 경계를 두르는 데다 브라우저마다 달라서 끄고,
// 이식 원본(build.html `.gn:focus-visible .cdot, .fpill`)대로 점·알약 자체에 글자색 테두리를 두른다.
// 키보드로 왔을 때만(focus-visible) 보인다 — 마우스로 눌러 생긴 포커스에는 후광·흐림이 이미 응답하고 있다.
export const FOCUSABLE_GROUP_CLASS = 'group focus:outline-none';
export const FOCUS_RING_CLASS = 'group-focus-visible:stroke-grayscale-800 group-focus-visible:stroke-[3px]';

// 노드 <g> 를 키보드로 닿고 누를 수 있게 하는 속성 묶음. 이식 원본(build.html)대로 Tab 으로 가고 Enter·Space 로 누른다.
// Space 는 기본 동작이 페이지 스크롤이라 막는다.
export const toKeyboardButtonProps = (activate: () => void) => ({
  tabIndex: 0,
  role: 'button' as const,
  onKeyDown: (event: KeyboardEvent<SVGGElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    activate();
  },
});

// 알약을 중심으로 12시부터 시계 방향 순서. 탭 순서는 곧 DOM 순서라, 키보드로 돌 때 화면에서 보이는 순서와 맞춘다.
// 좌표는 배치 함수가 낸 목표 좌표를 쓴다 — 움직이는 중에도 순서가 흔들리지 않게.
export const sortClockwise = (crews: GraphCrew[], center: {x: number; y: number}, layout: GraphLayout): GraphCrew[] => {
  const angleOf = (crew: GraphCrew) => {
    const position = layout[crewNodeKey(crew.documentUuid)];
    if (!position) return Infinity;

    // atan2 는 3시가 0 이고 시계 방향이 양수(SVG 는 y 가 아래로 자란다). 12시가 0 이 되도록 돌린다.
    return (Math.atan2(position.y - center.y, position.x - center.x) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
  };

  return [...crews].sort((a, b) => angleOf(a) - angleOf(b));
};
