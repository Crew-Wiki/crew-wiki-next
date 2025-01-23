'use client';

import {useCallback, useEffect} from 'react';
import useDebounce from '../useDebounce';
import {searchDocument} from '@api/document';
import {useFetch} from '@hooks/useFetch';

const useSearchDocumentByQuery = (query: string) => {
  const searchDocumentByQuery = useCallback(() => searchDocument(query), [query]);
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
