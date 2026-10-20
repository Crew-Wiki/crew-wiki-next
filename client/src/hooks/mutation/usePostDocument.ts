'use client';

import type {DocumentResponse, OrganizationDocumentResponse} from '@apis/generated/types';
import {DOCUMENT_TYPE} from '@constants/document';
import {PostDocumentContent} from '@store/document';
import * as Sentry from '@sentry/nextjs';
import useMutation from '@hooks/useMutation';
import useAmplitude from '@hooks/useAmplitude';
import {postDocumentClient} from '@apis/client/document';
import {revalidateOrganizationDocumentClient} from '@apis/client/organization';
import {useTrie} from '@store/trie';
import {route} from '@constants/route';
import {EDITOR} from '@constants/editor';
import {api} from '@apis/generated/client';

const postDocumentWithOrganizations = async (document: PostDocumentContent) => {
  const {newOrganizations, existingOrganizations, ...documentBody} = document;
  const savedDocument = await postDocumentClient(documentBody);

  const createdOrganizations = await Promise.all(
    newOrganizations.map(org =>
      api.organization.post({
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
      api.organization.link.post({
        crewDocumentUuid: savedDocument.documentUUID,
        organizationDocumentUuid: org.uuid,
      }),
    ),
  );

  const organizationUuidsToRevalidate = [...createdOrganizations, ...linkedOrganizations].map(
    org => org.organizationDocumentUuid,
  );
  if (organizationUuidsToRevalidate.length > 0) {
    try {
      await revalidateOrganizationDocumentClient(organizationUuidsToRevalidate);
    } catch (error) {
      Sentry.captureException(error, {
        tags: {action: 'revalidate-organization-cache'},
        extra: {organizationUuidsToRevalidate},
      });
    }
  }

  return {savedDocument, createdOrganizations: [...createdOrganizations, ...linkedOrganizations]};
};

export const usePostDocument = () => {
  const addTitle = useTrie(state => state.addTitle);
  const {trackDocumentCreate} = useAmplitude();

  const {mutate, isPending} = useMutation<
    PostDocumentContent,
    {savedDocument: DocumentResponse; createdOrganizations: OrganizationDocumentResponse[]}
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
