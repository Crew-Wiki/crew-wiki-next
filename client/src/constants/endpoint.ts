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

  // Organization Document
  getOrganizationDocumentByUUID: (uuid: string) => `/organization/uuid/${uuid}`,
  getOrganizationDocumentsByDocumentUUID: (uuid: string) => `/document/${uuid}/organization-documents`,
  postOrganizationDocument: '/organization',
  linkOrganizationDocument: '/organization/link',
  putOrganizationDocument: '/organization',
  deleteOrganizationFromDocument: (documentUuid: string, organizationDocumentUuid: string) =>
    `/document/${documentUuid}/organization-documents/${organizationDocumentUuid}`,

  // Organization Event
  postOrganizationEvent: '/organization-events',
  putOrganizationEvent: (uuid: string) => `/organization-events/${uuid}`,
  deleteOrganizationEvent: (uuid: string) => `/organization-events/${uuid}`,

  // Admin Auth
  postAdminLogin: '/auth/login',
  postAdminLogout: '/auth/logout',
  getLoginCheck: '/auth/login/check',
} as const;

export const CLIENT_ENDPOINT = {
  // Document
  postDocument: '/api/post-document',
  putDocument: '/api/put-document',
  getDocumentTitleList: '/api/get-document-title-list',
  deleteDocument: '/api/delete-document',

  // Organization
  putOrganizationDocument: '/api/put-organization-document',
  postOrganizationEvent: '/api/post-organization-event',
  revalidateOrganizationDocument: '/api/revalidate-organization-document',

  // View Count
  postViewCount: '/api/post-view-count',

  // Admin
  postAdminLogin: '/api/post-admin-login',
  postAdminLogout: '/api/post-admin-logout',
  deleteFrontendServerCache: '/api/delete-frontend-server-cache',
} as const;
