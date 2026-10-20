export const SORT_OPTIONS = {
  views: {
    displayName: '조회수',
    label: 'views',
  },
  edits: {
    displayName: '수정수',
    label: 'edits',
  },
} as const;

export const SortOptions = {
  views: {
    label: SORT_OPTIONS.views.label,
  },
  edits: {
    label: SORT_OPTIONS.edits.label,
  },
};

export type SortType = keyof typeof SortOptions;

/** 인기 문서 화면 전용 (대응 엔드포인트 없음 — 목데이터) */
export interface PopularDocument {
  id: number;
  title: string;
  viewCount: number;
  editCount: number;
}
