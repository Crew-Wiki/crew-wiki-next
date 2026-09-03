'use client';

import type {DocumentResponse, OrganizationDocumentSearchResponse} from '@apis/generated/types';
import {useFetch} from '@hooks/useFetch';
import {useCallback} from 'react';
import {api} from '@apis/generated/client';

/** 문서 응답 + 별도 API 로 가져온 조직 목록을 합친 화면 전용 타입 */
export type DocumentWithOrganizations = DocumentResponse & {
  organizations: OrganizationDocumentSearchResponse[];
};

export const useGetLatestDocumentByUUID = (uuid: string) => {
  const getData = useCallback(async () => {
    const [document, organizations] = await Promise.all([
      api.document.uuid(uuid).get(),
      api.document(uuid).organizationDocuments.get(),
    ]);

    return {
      ...document,
      organizations,
    };
  }, [uuid]);

  const {data, isLoading} = useFetch<DocumentWithOrganizations>(getData);

  return {
    document: data,
    isLoading,
  };
};
