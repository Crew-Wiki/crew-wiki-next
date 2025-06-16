'use client';

import {useCallback, useEffect} from 'react';
import useDebounce from '../useDebounce';
import {useFetch} from '@hooks/useFetch';
import {httpClient} from '@http/client';
import {ENDPOINT} from '@constants/endpoint';

const getSearchDocument = async (query: string) => {
  const response = await httpClient.get<string[]>({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    endpoint: ENDPOINT.getDocumentSearch,
    queryParams: {
      keyWord: query,
    },
  });

  return response;
};

type UseSearchDocumentByQueryOptions = {
  enabled?: boolean;
};

const useSearchDocumentByQuery = (query: string, options?: UseSearchDocumentByQueryOptions) => {
  const searchDocumentByQuery = useCallback(() => getSearchDocument(query), [query]);
  const {data, refetch} = useFetch(searchDocumentByQuery, {enabled: options?.enabled});

  const searchDocumentsIfValid = useCallback(() => {
    if (query.trim() !== '' && /^[가-힣()0-9]*$/.test(query)) refetch();
  }, [query, refetch]);

  const debouncedSearchDocuments = useDebounce(searchDocumentsIfValid, 100);

  useEffect(() => {
    debouncedSearchDocuments();
  }, [debouncedSearchDocuments, query]);

  return {
    titles: data ?? [],
  };
};

export default useSearchDocumentByQuery;
