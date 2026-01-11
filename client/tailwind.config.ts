import type {Config} from 'tailwindcss';
// 이 파일은 Node.js에서 직접 실행되기 때문에 path alias 사용 불가
import {colors} from './src/constants/colors';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
