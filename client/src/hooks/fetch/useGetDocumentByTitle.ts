'use client';

import {getDocumentByTitle} from '@api/document';
import {useFetch} from '@hooks/useFetch';
import {WikiDocument} from '@type/Document.type';

export const useGetDocumentByTitle = (title: string) => {
  const {data} = useFetch<WikiDocument>(() => getDocumentByTitle(title));

  return {
    document: data,
  };
};
