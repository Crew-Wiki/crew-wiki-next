'use client';

import {getDocumentByTitle} from '@apis/document';
import {useFetch} from '@hooks/useFetch';
import {WikiDocument} from '@type/Document.type';
import {useCallback} from 'react';

export const useGetDocumentByTitle = (title: string) => {
  const getData = useCallback(() => getDocumentByTitle(title), [title]);
  const {data} = useFetch<WikiDocument>(getData);

  return {
    document: data,
  };
};
