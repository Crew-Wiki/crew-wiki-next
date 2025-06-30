'use client';

import {useCallback, useEffect} from 'react';
import useDebounce from '../useDebounce';
import {useFetch} from '@hooks/useFetch';
import {getSearchDocumentClient} from '@apis/client/document';

type UseSearchDocumentByQueryOptions = {
  enabled?: boolean;
};

const useSearchDocumentByQuery = (query: string, options?: UseSearchDocumentByQueryOptions) => {
  const searchDocumentByQuery = useCallback(() => getSearchDocumentClient(query), [query]);
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
