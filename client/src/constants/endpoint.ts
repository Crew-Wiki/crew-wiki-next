const ENDPOINT = {
  POST_DOCUMENT: '/document',
  UPDATE_DOCUMENT: '/document',
  GET_DOCUMENT_BY_TITLE: '/document',
  GET_RANDOM_DOCUMENT: '/document',
  GET_RECENTLY_DOCUMENTS: '/document/recent',
  GET_DOCUMENT_SEARCH: '/document/search',
  GET_DOCUMENT_LOGS: (title: string) => `document/${title}/log`,
  GET_SPECIFIC_DOCUMENT_LOG: (logId: number) => `document/log/${logId}`,
} as const;

export default ENDPOINT;
