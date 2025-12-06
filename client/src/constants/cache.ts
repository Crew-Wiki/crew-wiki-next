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

// revalidate 1s
export const CACHE = {
  time: {
    basicRevalidate: 43200, // 12 hours
    longRevalidate: 604800, // 7 days
  },
  tag: {
    getDocuments: (params: PaginationParams) => generatePaginationCacheTags(params, 'documents'),
    getRecentlyDocuments: generatePaginationCacheTags(recentlyParams, 'documents'),
    getDocumentByTitle: (title: string) => `title:${decodeURI(title)}`,
    getDocumentByUUID: (uuid: string) => `title:${uuid}`,
    getDocumentLogsByUUID: (uuid: string) => `logs:${uuid}`,
    getSpecificDocumentLog: (logId: number) => `specificLog:${logId}`,

    getDocumentsUUID: 'get-documents-uuid',
  },
} as const;
