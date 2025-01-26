'use client';

import {useCallback, useEffect} from 'react';
import useDebounce from '../useDebounce';
import {useFetch} from '@hooks/useFetch';
import {requestGet} from '@apis/http';

const getSearchDocument = async (query: string) => {
  const response = requestGet<string[]>({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    endpoint: `/api/get-search-document?referQuery=${query}`,
  });

  return response;
};

const useSearchDocumentByQuery = (query: string) => {
  const searchDocumentByQuery = useCallback(() => getSearchDocument(query), [query]);
  const {data, refetch} = useFetch(searchDocumentByQuery, {enabled: true});

  const searchDocumentsIfValid = useCallback(() => {
    if (query.trim() !== '' && /^[가-힣()0-9]*$/.test(query)) refetch();
  }, [query, refetch]);

  const debouncedSearchDocuments = useDebounce(searchDocumentsIfValid, 200);

  useEffect(() => {
    debouncedSearchDocuments();
  }, [debouncedSearchDocuments, query]);

  return {
    titles: data ?? [],
  };
};

export default useSearchDocumentByQuery;
