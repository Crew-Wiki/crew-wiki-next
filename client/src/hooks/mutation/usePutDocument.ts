'use client';

import type {DocumentResponse, OrganizationDocumentResponse} from '@apis/generated/types';
import {DOCUMENT_TYPE} from '@constants/document';
import {PostDocumentContent} from '@store/document';
import * as Sentry from '@sentry/nextjs';
import useMutation from '@hooks/useMutation';
import useAmplitude from '@hooks/useAmplitude';
import {putDocumentClient} from '@apis/client/document';
import {revalidateOrganizationDocumentClient} from '@apis/client/organization';
import {useTrie} from '@store/trie';
import {useDocument} from '@store/document';
import {route} from '@constants/route';
import {EDITOR} from '@constants/editor';
import {api} from '@apis/generated/client';

export const usePutDocument = () => {
  const updateTitle = useTrie(state => state.updateTitle);
  const addTitle = useTrie(state => state.addTitle);
  const originalOrganizations = useDocument(state => state.originalOrganizations);
  const {trackDocumentUpdate} = useAmplitude();

  const putDocumentWithOrganizations = async (document: PostDocumentContent) => {
    const {newOrganizations, existingOrganizations, ...documentBody} = document;
    const savedDocument = await putDocumentClient(documentBody);

    const newlyLinkedOrganizations = existingOrganizations.filter(
      org => !originalOrganizations.some(original => original.uuid === org.uuid),
    );

    const deletedOrganizations = originalOrganizations.filter(
      original => !existingOrganizations.some(org => org.uuid === original.uuid),
    );

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
      newlyLinkedOrganizations.map(org =>
        api.organization.link.post({
          crewDocumentUuid: savedDocument.documentUUID,
          organizationDocumentUuid: org.uuid,
        }),
      ),
    );
    await Promise.all(
      deletedOrganizations.map(org =>
        api.document(savedDocument.documentUUID).organizationDocuments(org.uuid).delete(),
      ),
    );

    const organizationUuidsToRevalidate = [
      ...createdOrganizations.map(org => org.organizationDocumentUuid),
      ...linkedOrganizations.map(org => org.organizationDocumentUuid),
      ...deletedOrganizations.map(org => org.uuid),
    ];
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

  const {mutate, isPending} = useMutation<
    PostDocumentContent,
    {savedDocument: DocumentResponse; createdOrganizations: OrganizationDocumentResponse[]}
  >({
    mutationFn: putDocumentWithOrganizations,
    onSuccess: ({savedDocument, createdOrganizations}) => {
      trackDocumentUpdate(savedDocument.title, savedDocument.documentUUID);
      // TODO: 문서 제목 업데이트 기능 추가 시 updateTitle에 변경 전 문서 제목을 넣어야 합니다
      updateTitle(savedDocument.title, savedDocument.title, savedDocument.documentUUID, DOCUMENT_TYPE.Crew);
      createdOrganizations.forEach(org => {
        addTitle(org.title, org.organizationDocumentUuid, DOCUMENT_TYPE.Organization);
      });
      window.location.href = route.goWiki(savedDocument.documentUUID);
    },
  });

  return {
    putDocument: mutate,
    isPutPending: isPending,
  };
};
