import {getDocumentTitleListClient} from '@apis/client/document';
import {useFetch} from '@hooks/useFetch';
import {TitleAndUUID} from '@type/Document.type';

export const useGetDocumentTitleList = () => {
  const {data} = useFetch<TitleAndUUID[]>(getDocumentTitleListClient);

  return {
    data: data ?? [],
    titles: data?.map(value => value.title) ?? [],
    uuids: data?.map(value => value.uuid) ?? [],
  };
};
