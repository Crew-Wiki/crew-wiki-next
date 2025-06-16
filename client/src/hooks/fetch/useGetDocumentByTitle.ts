'use client';

import {httpClient} from '@http/client';
import {ENDPOINT} from '@constants/endpoint';
import {useFetch} from '@hooks/useFetch';
import {WikiDocument} from '@type/Document.type';
import {useCallback} from 'react';

export const useGetDocumentByTitle = (title: string) => {
  const getDocumentByTitle = async (title: string) => {
    const response = await httpClient.get<WikiDocument>({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      endpoint: `${ENDPOINT.getDocumentByTitle}/${title}`,
    });

    return response;
  };

  const getData = useCallback(() => getDocumentByTitle(title), [title]);
  const {data} = useFetch<WikiDocument>(getData);

  return {
    document: data,
  };
};
