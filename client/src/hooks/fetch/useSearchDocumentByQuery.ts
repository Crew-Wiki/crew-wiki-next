'use client';

import {useCallback, useEffect} from 'react';
import useDebounce from '../useDebounce';
import {useFetch} from '@hooks/useFetch';
import {requestGet} from '@apis/http';

const useSearchDocumentByQuery = (query: string) => {
  const getSearchDocument = async (query: string) => {
    const response = requestGet<string[]>({
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      endpoint: `/api/get-search-document?referQuery=${query}`,
    });

    return response;
  };

  const searchDocumentByQuery = useCallback(() => getSearchDocument(query), [query]);
  const {data, refetch, setData} = useFetch(searchDocumentByQuery, {enabled: true});

  const searchDocumentsIfValid = useCallback(() => {
    if (query.trim() !== '' && /^[가-힣()0-9]*$/.test(query)) refetch();
  }, [query, refetch]);

  const debouncedSearchDocuments = useDebounce(searchDocumentsIfValid, 200);

  useEffect(() => {
    setData(null);
    debouncedSearchDocuments();
  }, [debouncedSearchDocuments, query, setData]);

  return {
    titles: data ?? [],
  };
};

export default useSearchDocumentByQuery;
