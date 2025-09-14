export type ViewCountByUUID = {[uuid: string]: number};

export type ViewData = {
  accumulative_count: ViewCountByUUID;
};

export type IncrementResult = ViewData & {
  shouldFlush: boolean;
  total_views_to_flush?: number;
};
