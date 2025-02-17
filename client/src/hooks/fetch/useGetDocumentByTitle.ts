'use client';

import {requestGet} from '@apis/http';
import {useFetch} from '@hooks/useFetch';
import {WikiDocument} from '@type/Document.type';
import {useCallback} from 'react';

export const useGetDocumentByTitle = (title: string) => {
  const getDocumentByTitle = async (title: string) => {
    const response = await requestGet<WikiDocument>({
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      endpoint: `/api/get-document-by-title?title=${title}`,
      cache: 'no-cache',
    });

    return response;
  };

  const getData = useCallback(() => getDocumentByTitle(title), [title]);
  const {data} = useFetch<WikiDocument>(getData);

  return {
    document: data,
  };
};
