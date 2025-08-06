export type ViewData = {
  current_count: {[uuid: string]: number};
  failed_count: {[uuid: string]: number};
};

export type IncrementResult = {
  current_count: {[uuid: string]: number};
  failed_count: {[uuid: string]: number};
  shouldFlush: boolean;
  total_views_to_flush?: number;
  incremented_uuid: string;
  incremented_count: number;
};
