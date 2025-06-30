'use client';

import {useFetch} from '@hooks/useFetch';
import {WikiDocument} from '@type/Document.type';
import {useCallback} from 'react';
import {getDocumentByTitleClient} from '@apis/client/document';

export const useGetDocumentByTitle = (title: string) => {
  const getData = useCallback(() => getDocumentByTitleClient(title), [title]);
  const {data} = useFetch<WikiDocument>(getData);

  return {
    document: data,
  };
};
