import {PaginationParams} from '@type/General.type';
import {recentlyParams} from './params';

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

export const TAG_PREFIX = 'wiki/';

export const CACHE = {
  time: {
    basicRevalidate: 43200, // 12 hours
    longRevalidate: 604800, // 7 days
  },
  tag: {
    getDocuments: (params: PaginationParams) => TAG_PREFIX + generatePaginationCacheTags(params, 'documents'),
    getRecentlyDocuments: TAG_PREFIX + generatePaginationCacheTags(recentlyParams, 'documents'),
    getDocumentByTitle: (title: string) => TAG_PREFIX + `title:${decodeURI(title)}`,
    getDocumentByUUID: (uuid: string) => TAG_PREFIX + `title:${uuid}`,
    getDocumentLogsByUUID: (uuid: string) => TAG_PREFIX + `logs:${uuid}`,
    getSpecificDocumentLog: (logId: number) => TAG_PREFIX + `specificLog:${logId}`,

    getDocumentsUUID: TAG_PREFIX + 'get-documents-uuid',
  },
} as const;
