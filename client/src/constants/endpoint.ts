export const ENDPOINT = {
  postDocument: '/document',
  updateDocument: '/document',
  getDocuments: '/document',
  getDocumentByTitle: (title: string) => `/document/titie/${title}`,
  getDocumentByUUID: (uuid: string) => `/document/uuid/${uuid}`,
  getRandomDocument: '/document/random',
  getDocumentSearch: '/document/search',
  getDocumentLogsByTitle: (title: string) => `/document/${title}/log`,
  getDocumentLogsByUUID: (uuid: string) => `/document/uuid/${uuid}/log`,
  getSpecificDocumentLog: (logId: number) => `/document/log/${logId}`,
  postAdminLogin: '/admin/login',
  getPresignedUrl: '/upload',
} as const;
