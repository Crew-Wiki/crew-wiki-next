// ISR : cache 시간 어떻게 가져갈 지 논의

import {PaginationParams} from '@type/General.type';
import {allDocuemtsParams, recentlyParams} from './params';

export const generatePaginationCacheTags = (
  {pageNumber, pageSize, sort, sortDirection}: PaginationParams,
  originTag: string,
): string => {
  return [
    originTag,
    `page=${pageNumber}`,
    `size=${pageSize}`,
    `sort=${sort}`,
    `dir=${sortDirection.toLowerCase()}`,
  ].join('|');
};

// revalidate 1s
export const CACHE = {
  time: {
    basicRevalidate: 43200, // 12 hours
    longRevalidate: 604800, // 7 days
  },
  tag: {
    getDocuments: (params: PaginationParams) => generatePaginationCacheTags(params, 'documents'),
    getAllDocuments: generatePaginationCacheTags(allDocuemtsParams, 'all-documents'),
    getDocumentByTitle: (title: string) => `title:${decodeURI(title)}`,
    getDocumentByUUID: (uuid: string) => `title:${uuid}`,
    getRecentlyDocuments: generatePaginationCacheTags(recentlyParams, 'recently'),
    getDocumentLogsByUUID: (uuid: string) => `logs:${uuid}`,
    getSpecificDocumentLog: (logId: number) => `specificLog:${logId}`,
    getDocumentSearch: 'search',
    getRandomDocument: 'random',
  },
} as const;
