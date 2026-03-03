'use client';

import {getDocumentByUUIDClient} from '@apis/client/document';
import {useFetch} from '@hooks/useFetch';
import {LatestWikiDocument} from '@type/Document.type';
import {useCallback} from 'react';

export const useGetLatestDocumentByUUID = (uuid: string) => {
  const getData = useCallback(() => getDocumentByUUIDClient(uuid), [uuid]);
  const {data, isLoading} = useFetch<LatestWikiDocument>(getData);

  return {
    document: data,
    isLoading,
  };
};
