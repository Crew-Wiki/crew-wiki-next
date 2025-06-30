'use client';

import {getRecentlyDocumentsClient} from '@apis/client/document';
import {useFetch} from '@hooks/useFetch';
import {RecentlyDocument} from '@type/Document.type';
import {useCallback} from 'react';

export const useGetRecentlyDocuments = () => {
  const getData = useCallback(getRecentlyDocumentsClient, []);
  const {data} = useFetch<RecentlyDocument[]>(getData);

  return {
    documents: data ?? [],
  };
};
