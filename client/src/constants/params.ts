import type {PagingRequest} from '@apis/generated/types';

export const recentlyParams: PagingRequest = {
  pageNumber: 0,
  pageSize: 20,
  sort: 'generateTime',
  sortDirection: 'DESC',
};

export const documentLogsParams: PagingRequest = {
  pageNumber: 0,
  pageSize: 10,
  sort: 'id',
  sortDirection: 'DESC',
};
