// OS 의 "동작 줄이기" 설정. 켜져 있으면 스프링·등장 연출을 건너뛰고 바로 제자리에 놓는다.
// 매번 물어본다 — 설정은 드물게 바뀌지만 바뀐 순간부터 바로 따르고 싶고, 묻는 비용은 없다시피 하다.
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
