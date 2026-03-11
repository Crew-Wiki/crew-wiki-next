'use client';

import useMutation from '@hooks/useMutation';
import {DOCUMENT_TYPE, PostDocumentContent, WikiDocument} from '@type/Document.type';
import useAmplitude from '@hooks/useAmplitude';
import {postDocumentClient} from '@apis/client/document';
import {
  postOrganizationDocumentClient,
  linkOrganizationDocumentClient,
  revalidateOrganizationDocumentClient,
} from '@apis/client/organization';
import {useTrie} from '@store/trie';
import {route} from '@constants/route';
import {GroupDocumentResponse} from '@type/Group.type';
import {EDITOR} from '@constants/editor';

const postDocumentWithOrganizations = async (document: PostDocumentContent) => {
  const {newOrganizations, existingOrganizations, ...documentBody} = document;
  const savedDocument = await postDocumentClient(documentBody);

  const createdOrganizations = await Promise.all(
    newOrganizations.map(org =>
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

  const linkedOrganizations = await Promise.all(
    existingOrganizations.map(org =>
      linkOrganizationDocumentClient({
        crewDocumentUuid: savedDocument.documentUUID,
        organizationDocumentUuid: org.uuid,
      }),
    ),
  );

  const organizationUuidsToRevalidate = [...createdOrganizations, ...linkedOrganizations].map(
    org => org.organizationDocumentUuid,
  );
  if (organizationUuidsToRevalidate.length > 0) {
    await revalidateOrganizationDocumentClient(organizationUuidsToRevalidate);
  }

  return {savedDocument, createdOrganizations: [...createdOrganizations, ...linkedOrganizations]};
};

export const usePostDocument = () => {
  const addTitle = useTrie(state => state.addTitle);
  const {trackDocumentCreate} = useAmplitude();

  const {mutate, isPending} = useMutation<
    PostDocumentContent,
    {savedDocument: WikiDocument; createdOrganizations: GroupDocumentResponse[]}
  >({
    mutationFn: postDocumentWithOrganizations,
    onSuccess: ({savedDocument, createdOrganizations}) => {
      trackDocumentCreate(savedDocument.title, savedDocument.documentUUID);
      addTitle(savedDocument.title, savedDocument.documentUUID, DOCUMENT_TYPE.Crew);
      createdOrganizations.forEach(org => {
        addTitle(org.title, org.organizationDocumentUuid, DOCUMENT_TYPE.Organization);
      });
      window.location.href = route.goWiki(savedDocument.documentUUID);
    },
  });

  return {
    postDocument: mutate,
    isPostPending: isPending,
  };
};
