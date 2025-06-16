'use client';

import {httpClient} from '@http/client';
import {ENDPOINT} from '@constants/endpoint';
import {useFetch} from '@hooks/useFetch';
import {RecentlyDocument} from '@type/Document.type';
import {useCallback} from 'react';

export const useGetRecentlyDocuments = () => {
  const getRecentlyDocuments = () => {
    const documents = httpClient.get<RecentlyDocument[]>({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      endpoint: ENDPOINT.getRecentlyDocuments,
    });

    return documents;
  };

  const getData = useCallback(getRecentlyDocuments, []);
  const {data} = useFetch<RecentlyDocument[]>(getData);

  return {
    documents: data ?? [],
  };
};
