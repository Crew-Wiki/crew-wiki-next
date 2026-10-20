'use client';

import type {DocumentResponse} from '@apis/generated/types';
import {useFetch} from '@hooks/useFetch';
import {useCallback} from 'react';
import {api} from '@apis/generated/client';

export const useGetDocumentByTitle = (title: string) => {
  const getData = useCallback(() => api.document.title(title).get(), [title]);
  const {data} = useFetch<DocumentResponse>(getData);

  return {
    document: data,
  };
};
