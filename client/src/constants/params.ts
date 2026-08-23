import {PaginationParams} from '@type/General.type';

export const recentlyParams: PaginationParams = {
  pageNumber: 0,
  pageSize: 20,
  sort: 'generateTime',
  sortDirection: 'DESC',
};

export const documentLogsParams: PaginationParams = {
  pageNumber: 0,
  pageSize: 10,
  sort: 'id',
  sortDirection: 'DESC',
};
