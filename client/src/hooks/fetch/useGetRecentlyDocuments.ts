'use client';

import {requestGet} from '@apis/http';
import {useFetch} from '@hooks/useFetch';
import {RecentlyDocument} from '@type/Document.type';
import {useCallback} from 'react';

export const useGetRecentlyDocuments = () => {
  const getRecentlyDocuments = () => {
    const documents = requestGet<RecentlyDocument[]>({
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      endpoint: '/api/get-recently-documents',
      cache: 'no-cache',
    });

    return documents;
  };

  const getData = useCallback(getRecentlyDocuments, []);
  const {data} = useFetch<RecentlyDocument[]>(getData);

  return {
    documents: data ?? [],
  };
};
