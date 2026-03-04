'use client';

import useMutation from '@hooks/useMutation';
import {DOCUMENT_TYPE, PostDocumentContent, WikiDocument} from '@type/Document.type';
import {useRouter} from 'next/navigation';
import useAmplitude from '@hooks/useAmplitude';
import {putDocumentClient} from '@apis/client/document';
import {
  deleteOrganizationFromDocumentClient,
  linkOrganizationDocumentClient,
  postOrganizationDocumentClient,
} from '@apis/client/organization';
import {useTrie} from '@store/trie';
import {useDocument} from '@store/document';
import {route} from '@constants/route';
import {GroupDocumentResponse} from '@type/Group.type';
import {EDITOR} from '@constants/editor';

export const usePutDocument = () => {
  const router = useRouter();
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
      newlyLinkedOrganizations.map(org =>
        linkOrganizationDocumentClient({
          crewDocumentUuid: savedDocument.documentUUID,
          organizationDocumentUuid: org.uuid,
        }),
      ),
    );

    await Promise.all(
      deletedOrganizations.map(org => deleteOrganizationFromDocumentClient(savedDocument.documentUUID, org.uuid)),
    );

    return {savedDocument, createdOrganizations: [...createdOrganizations, ...linkedOrganizations]};
  };

  const {mutate, isPending} = useMutation<
    PostDocumentContent,
    {savedDocument: WikiDocument; createdOrganizations: GroupDocumentResponse[]}
  >({
    mutationFn: putDocumentWithOrganizations,
    onSuccess: ({savedDocument, createdOrganizations}) => {
      trackDocumentUpdate(savedDocument.title, savedDocument.documentUUID);
      // TODO: 문서 제목 업데이트 기능 추가 시 updateTitle에 변경 전 문서 제목을 넣어야 합니다
      updateTitle(savedDocument.title, savedDocument.title, savedDocument.documentUUID, DOCUMENT_TYPE.Crew);
      createdOrganizations.forEach(org => {
        addTitle(org.title, org.organizationDocumentUuid, DOCUMENT_TYPE.Organization);
      });
      router.push(route.goWiki(savedDocument.documentUUID));
      router.refresh();
    },
  });

  return {
    putDocument: mutate,
    isPutPending: isPending,
  };
};
