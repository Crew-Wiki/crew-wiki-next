export const ENDPOINT = {
  // Document
  postDocument: '/document',
  updateDocument: '/document',
  getDocuments: '/document',
  getDocumentByTitle: (title: string) => `/document/title/${title}`,
  getDocumentByUUID: (uuid: string) => `/document/uuid/${uuid}`,
  getRandomDocument: '/document/random',
  getDocumentSearch: '/document/search',
  getDocumentLogsByTitle: (title: string) => `/document/${title}/log`,
  getDocumentLogsByUUID: (uuid: string) => `/document/uuid/${uuid}/log`,
  getSpecificDocumentLog: (logId: number) => `/document/log/${logId}`,
  getPresignedUrl: '/upload',
  postViewsFlush: '/document/views/flush',
  deleteDocument: (uuid: string) => `/admin/documents/${uuid}`,

  // Organization Event
  postOrganizationEvent: '/organization-events',
  deleteOrganizationEvent: (uuid: string) => `/organization-events/${uuid}`,

  // Admin Auth
  postAdminLogin: '/auth/login',
  postAdminLogout: '/auth/logout',
  getLoginCheck: '/auth/login/check',
} as const;
