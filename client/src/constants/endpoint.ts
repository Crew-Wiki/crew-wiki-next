export const ENDPOINT = {
  postDocument: '/document',
  updateDocument: '/document',
  getDocumentByTitle: '/document',
  getRandomDocument: '/document',
  getRecentlyDocuments: '/document/recent',
  getDocumentSearch: '/document/search',
  getDocumentLogs: (title: string) => `document/${title}/log`,
  getSpecificDocumentLog: (logId: number) => `document/log/${logId}`,
} as const;
