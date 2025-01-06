// ISR : cache 시간 어떻게 가져갈 지 논의 (안 가져가는 것도 좋을 듯)
export const CACHE = {
  time: {
    revalidate: 30,
  },
  tag: {
    getDocumentByTitle: 'get-document-by-title',
    getRecentlyDocuments: 'get-recently-documents',
    getDocumentLogs: 'get-document-logs',
    getSpecificDocumentLog: 'get-specific-document-log',
    getDocumentSearch: 'get-document-search',
    getRandomDocument: 'get-random-document',
  },
} as const;
