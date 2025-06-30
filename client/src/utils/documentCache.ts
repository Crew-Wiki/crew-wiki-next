import {getAllDocumentsServer} from '@apis/server/document';
import {WikiDocumentExpand} from '@type/Document.type';

/**
 * 프로세스 전역 캐시
 * - documentsMap   : document Map (uuid -> WikiDocumentExpand)
 * - inFlight  : 동일 시점에 여러 함수가 호출될 때 중복 fetch 방지용 Promise
 */
let documentsMap: Map<string, WikiDocumentExpand> | null = null;
let inFlight: Promise<Map<string, WikiDocumentExpand>> | null = null;

export const getDocumentsMap = async (): Promise<Map<string, WikiDocumentExpand>> => {
  if (documentsMap) return documentsMap; // 캐시 hit

  // 이미 fetch 중이면 그 Promise 재사용
  if (inFlight) return inFlight;

  // 처음 호출 ⇒ 네트워크 요청 + Map 생성
  inFlight = (async () => {
    const list = await getAllDocumentsServer();
    documentsMap = new Map(list.map(document => [document.uuid, document]));
    inFlight = null; // fetch 완료 후 초기화
    return documentsMap;
  })();

  return inFlight;
};

// 문서가 추가, 수정된 후에 캐시 데이터를 초기화하는 메서드
export const clearDocumentsCache = () => {
  documentsMap = null; // 완성된 Map 제거
  inFlight = null; // 진행 중이던 fetch(있다면)도 무효화
};
