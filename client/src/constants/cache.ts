// ISR : cache 시간 어떻게 가져갈 지 논의 (안 가져가는 것도 좋을 듯)
export const CACHE = {
  time: {
    revalidate: 30,
  },
  tag: {
    getDocuments: 'documents',
    getDocumentByTitle: (title: string) => `title:${decodeURI(title)}`,
    getRecentlyDocuments: 'recently',
    getDocumentLogs: 'logs',
    getSpecificDocumentLog: 'specificLog',
    getDocumentSearch: 'search',
    getRandomDocument: 'random',
  },
} as const;
