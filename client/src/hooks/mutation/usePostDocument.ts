'use client';

import useMutation from '@hooks/useMutation';
import {PostDocumentContent, WikiDocument} from '@type/Document.type';
import {useRouter} from 'next/navigation';
import useAmplitude from '@hooks/useAmplitude';
import {postDocumentClient} from '@apis/client/document';
import {postOrganizationDocumentClient} from '@apis/client/organization';
import {useTrie} from '@store/trie';
import {route} from '@constants/route';

const postDocumentWithOrganizations = async (document: PostDocumentContent) => {
  const savedDocument = await postDocumentClient(document);

  await Promise.all(
    document.organizations.map(org =>
      postOrganizationDocumentClient({
        title: org.title,
        contents: '',
        writer: document.writer,
        documentBytes: 0,
        crewDocumentUuid: savedDocument.documentUUID,
        organizationDocumentUuid: org.uuid,
      }),
    ),
  );

  return savedDocument;
};

export const usePostDocument = () => {
  const router = useRouter();
  const addTitle = useTrie(state => state.addTitle);
  const {trackDocumentCreate} = useAmplitude();

  const {mutate, isPending} = useMutation<PostDocumentContent, WikiDocument>({
    mutationFn: postDocumentWithOrganizations,
    onSuccess: document => {
      trackDocumentCreate(document.title, document.documentUUID);
      addTitle(document.title, document.documentUUID, 'CREW');
      router.push(route.goWiki(document.documentUUID));
      router.refresh();
    },
  });

  return {
    postDocument: mutate,
    isPostPending: isPending,
  };
};
