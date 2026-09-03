import {getDocumentTitleListClient} from '@apis/client/document';
import {DocumentSearchResponse} from '@apis/generated/types';
import {useFetch} from '@hooks/useFetch';

export const useGetDocumentTitleList = () => {
  const {data} = useFetch<DocumentSearchResponse[]>(getDocumentTitleListClient);

  return {
    data: data ?? [],
    titles: data?.map(value => value.title) ?? [],
    uuids: data?.map(value => value.uuid) ?? [],
  };
};
