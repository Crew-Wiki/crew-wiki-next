import {getDocumentsMap} from './documentCache';

export const getDocumentTitleUsingUUID = async (uuid: string) => {
  const documentMap = await getDocumentsMap();
  const title = documentMap.get(uuid)?.title;

  if (!title) {
    throw new Error(`캐시에 ${uuid}를 가진 문서가 없습니다.`);
  }

  return title;
};

export const getDocumentUsingUUID = async (uuid: string) => {
  const documentMap = await getDocumentsMap();
  const document = documentMap.get(uuid);

  return document || null;
};
