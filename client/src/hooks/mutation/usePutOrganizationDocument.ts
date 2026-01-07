'use client';

import useMutation from '@hooks/useMutation';
import {useRouter} from 'next/navigation';
import {putOrganizationDocumentClient} from '@apis/client/organization';
import {useTrie} from '@store/trie';
import {route} from '@constants/route';
import {GroupDocumentResponse, OrganizationDocumentUpdateRequest} from '@type/Group.type';

export const usePutOrganizationDocument = () => {
  const router = useRouter();
  const updateTitle = useTrie(state => state.updateTitle);

  const {mutate, isPending} = useMutation<OrganizationDocumentUpdateRequest, GroupDocumentResponse>({
    mutationFn: putOrganizationDocumentClient,
    onSuccess: document => {
      updateTitle(document.title, document.title, document.organizationDocumentUuid, 'ORGANIZATION');
      router.push(route.goWikiGroup(document.organizationDocumentUuid));
      router.refresh();
    },
  });

  return {
    putOrganizationDocument: mutate,
    isPutPending: isPending,
  };
};
