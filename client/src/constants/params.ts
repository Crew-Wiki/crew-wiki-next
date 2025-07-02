import {PaginationParams} from '@type/General.type';

export const recentlyParams: PaginationParams = {
  pageNumber: 0,
  pageSize: 20,
  sort: 'generateTime',
  sortDirection: 'DESC',
};

export const allDocumentsParams: PaginationParams = {
  pageNumber: 0,
  pageSize: 10000, // 임의로 10000으로 설정, 나중에 전체 크기를 알 수 있는 api 필요
  sort: 'generateTime',
  sortDirection: 'ASC',
};
