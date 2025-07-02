import {getAllDocumentsServer} from '@apis/server/document';
import type {WikiDocumentExpand} from '@type/Document.type';

/**
 * 프로세스 전역 캐시
 * - documentsMap   : document Map (uuid -> WikiDocumentExpand)
 * - inFlight  : 동일 시점에 여러 함수가 호출될 때 중복 fetch 방지용 Promise
 */
type GlobalCache = {
  documentMap?: Map<string, WikiDocumentExpand> | null;
  inFlight?: Promise<Map<string, WikiDocumentExpand>> | null;
};
const global = globalThis as unknown as GlobalCache;

global.documentMap ??= null;
global.inFlight ??= null;

export const getDocumentsMap = async (): Promise<Map<string, WikiDocumentExpand>> => {
  if (global.documentMap) return global.documentMap;
  if (global.inFlight) return global.inFlight;

  global.inFlight = (async () => {
    const list = await getAllDocumentsServer();
    global.documentMap = new Map(list.map(document => [document.uuid, document]));
    global.inFlight = null;
    return global.documentMap;
  })();

  return global.inFlight;
};

export const addDocumentCache = async (document: WikiDocumentExpand) => {
  const map = await getDocumentsMap();
  map.set(document.uuid, document);
};

export const updateDocumentCache = async (document: WikiDocumentExpand) => {
  const map = await getDocumentsMap();
  map.set(document.uuid, document);
};

export const deleteDocumentCache = async (document: WikiDocumentExpand) => {
  const map = await getDocumentsMap();
  map.delete(document.uuid);
};

export const clearDocumentsCache = () => {
  global.documentMap = null;
  global.inFlight = null;
};
