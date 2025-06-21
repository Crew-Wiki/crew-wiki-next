export const ENDPOINT = {
  postDocument: '/document',
  updateDocument: '/document',
  getDocumentByTitle: '/document',
  getRandomDocument: '/document',
  getRecentlyDocuments: '/document/recent',
  getDocumentSearch: '/document/search',
  getDocumentLogsByTitle: (title: string) => `/document/${title}/log`,
  getSpecificDocumentLog: (logId: number) => `/document/log/${logId}`,
  postAdminLogin: '/admin/login',
  deleteDocument: (documentId: number) => `/admin/documents/${documentId}`,
} as const;
