import type {PagingRequest} from '@apis/generated/types';

export const recentlyParams: PagingRequest = {
  pageNumber: 0,
  pageSize: 20,
  sort: 'generateTime',
  sortDirection: 'DESC',
};

export const allDocumentsParams: PagingRequest = {
  pageNumber: 0,
  pageSize: 10000, // 임의로 10000으로 설정, 나중에 전체 크기를 알 수 있는 api 필요
  sort: 'generateTime',
  sortDirection: 'ASC',
};

export const documentLogsParams: PagingRequest = {
  pageNumber: 0,
  pageSize: 10,
  sort: 'id',
  sortDirection: 'DESC',
};
