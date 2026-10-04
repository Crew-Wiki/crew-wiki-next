import type {Config} from 'tailwindcss';
// 이 파일은 Node.js에서 직접 실행되기 때문에 path alias 사용 불가
import {colors} from './src/constants/colors';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // 분야별 색 클래스가 constants/graph.ts 에 문자열로 들어 있다.
    // 여기에 없으면 Tailwind 가 그 클래스를 생성하지 않아 노드가 전부 검정으로 그려진다.
    './src/constants/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        bm: ['var(--font-bm)', 'sans-serif'],
        pretendard: ['var(--font-pretendard)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
