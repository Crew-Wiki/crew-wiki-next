'use client';

import type {OrganizationDocumentResponse, OrganizationDocumentUpdateRequest} from '@apis/generated/types';
import {DOCUMENT_TYPE} from '@constants/document';
import useMutation from '@hooks/useMutation';
import {useRouter} from 'next/navigation';
import {putOrganizationDocumentClient} from '@apis/client/organization';
import {useTrie} from '@store/trie';
import {route} from '@constants/route';

export const usePutOrganizationDocument = () => {
  const router = useRouter();
  const updateTitle = useTrie(state => state.updateTitle);

  const {mutate, isPending} = useMutation<OrganizationDocumentUpdateRequest, OrganizationDocumentResponse>({
    mutationFn: putOrganizationDocumentClient,
    onSuccess: document => {
      updateTitle(document.title, document.title, document.organizationDocumentUuid, DOCUMENT_TYPE.Organization);
      router.push(route.goWikiGroup(document.organizationDocumentUuid));
      router.refresh();
    },
  });

  return {
    putOrganizationDocument: mutate,
    isPutPending: isPending,
  };
};
