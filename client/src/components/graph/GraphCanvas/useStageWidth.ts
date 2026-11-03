import {useLayoutEffect, useRef, useState} from 'react';

// 그래프가 놓인 자리의 너비. 좁은 화면 판정과 viewBox 맞춤이 이 값에서 나온다.
// 처음엔 null — 아직 재지 않았다는 뜻이다. 창 크기나 레이아웃이 바뀌면 ResizeObserver 가 다시 잰다.
export const useStageWidth = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState<number | null>(null);

  // 레이아웃 effect 인 이유: 첫 그림이 화면에 나가기 전에 재야 한다. 그래야 좁은 화면에서 넓은 배치가 잠깐 보였다가 접히는 일이 없다.
  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const measure = () => {
      const width = Math.round(element.getBoundingClientRect().width);
      // 숨겨진 자리(닫힌 탭 등)는 너비가 0 이다. 그때는 재지 않은 것으로 두고 보일 때까지 기다린다.
      setStageWidth(width > 0 ? width : null);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return {containerRef, stageWidth};
};
