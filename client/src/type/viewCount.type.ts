export type ViewCountByUUID = {[uuid: string]: number};

export type ViewData = {
  current_count: ViewCountByUUID;
  failed_count: ViewCountByUUID;
};

export type IncrementResult = {
  current_count: ViewCountByUUID;
  failed_count: ViewCountByUUID;
  shouldFlush: boolean;
  total_views_to_flush?: number;
  incremented_uuid: string;
  incremented_count: number;
};
