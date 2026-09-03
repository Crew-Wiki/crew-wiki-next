import type {ViewFlushRequest} from '@apis/generated/types';

/** 조회수 반영 요청 payload 와 동일한 형태를 로컬 파일에도 그대로 저장한다 */
export type ViewCountByUUID = ViewFlushRequest['views'];

export type ViewData = {
  accumulative_count: ViewCountByUUID;
};

export type IncrementResult = ViewData & {
  shouldFlush: boolean;
  total_views_to_flush?: number;
};
