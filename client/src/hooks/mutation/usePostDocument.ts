'use client';

import useMutation from '@hooks/useMutation';
import {DocumentType, PostDocumentContent, WikiDocument} from '@type/Document.type';
import {useRouter} from 'next/navigation';
import useAmplitude from '@hooks/useAmplitude';
import {postDocumentClient} from '@apis/client/document';
import {postOrganizationDocumentClient} from '@apis/client/organization';
import {useTrie} from '@store/trie';
import {route} from '@constants/route';
import {GroupDocumentResponse} from '@type/Group.type';
import {EDITOR} from '@constants/editor';

const postDocumentWithOrganizations = async (document: PostDocumentContent) => {
  const savedDocument = await postDocumentClient(document);

  const createdOrganizations = await Promise.all(
    document.organizations.map(org =>
      postOrganizationDocumentClient({
        title: org.title,
        contents: EDITOR.organizationInitialValue,
        writer: document.writer,
        documentBytes: 0,
        crewDocumentUuid: savedDocument.documentUUID,
        organizationDocumentUuid: org.uuid,
      }),
    ),
  );

  return {savedDocument, createdOrganizations};
};

export const usePostDocument = () => {
  const router = useRouter();
  const addTitle = useTrie(state => state.addTitle);
  const {trackDocumentCreate} = useAmplitude();

  const {mutate, isPending} = useMutation<
    PostDocumentContent,
    {savedDocument: WikiDocument; createdOrganizations: GroupDocumentResponse[]}
  >({
    mutationFn: postDocumentWithOrganizations,
    onSuccess: ({savedDocument, createdOrganizations}) => {
      trackDocumentCreate(savedDocument.title, savedDocument.documentUUID);
      addTitle(savedDocument.title, savedDocument.documentUUID, DocumentType.Crew);
      createdOrganizations.forEach(org => {
        addTitle(org.title, org.organizationDocumentUuid, DocumentType.Organization);
      });
      router.push(route.goWiki(savedDocument.documentUUID));
      router.refresh();
    },
  });

  return {
    postDocument: mutate,
    isPostPending: isPending,
  };
};
