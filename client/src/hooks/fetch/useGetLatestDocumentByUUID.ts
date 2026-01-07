'use client';

import {getDocumentByUUIDClient, getOrganizationDocumentsByDocumentUUIDClient} from '@apis/client/document';
import {useFetch} from '@hooks/useFetch';
import {LatestWikiDocument} from '@type/Document.type';
import {Organization} from '@type/Group.type';
import {useCallback} from 'react';

type DocumentWithOrganizations = LatestWikiDocument & {
  organizations: Organization[];
};

export const useGetLatestDocumentByUUID = (uuid: string) => {
  const getData = useCallback(async () => {
    const [document, organizations] = await Promise.all([
      getDocumentByUUIDClient(uuid),
      getOrganizationDocumentsByDocumentUUIDClient(uuid),
    ]);

    return {
      ...document,
      organizations,
    };
  }, [uuid]);

  const {data} = useFetch<DocumentWithOrganizations>(getData);

  return {
    document: data,
  };
};
