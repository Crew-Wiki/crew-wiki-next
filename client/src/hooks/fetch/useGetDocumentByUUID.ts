'use client';

import {getDocumentByUUIDClient} from '@apis/client/document';
import {useFetch} from '@hooks/useFetch';
import {WikiDocument} from '@type/Document.type';
import {useCallback} from 'react';

export const useGetDocumentByUUID = (uuid: string) => {
  const getData = useCallback(() => getDocumentByUUIDClient(uuid), [uuid]);
  const {data} = useFetch<WikiDocument>(getData);

  return {
    document: data,
  };
};
