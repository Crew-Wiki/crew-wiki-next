import {getDocumentTitleListClient, TitleAndUUID} from '@apis/client/document';
import {useFetch} from '@hooks/useFetch';

export const useGetDocumentTitleList = () => {
  const {data} = useFetch<TitleAndUUID[]>(getDocumentTitleListClient);

  return {
    data: data ?? [],
    titles: data?.map(value => value.title) ?? [],
    uuids: data?.map(value => value.uuid) ?? [],
  };
};
