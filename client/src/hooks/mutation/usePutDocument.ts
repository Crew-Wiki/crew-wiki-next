'use client';

import useMutation from '@hooks/useMutation';
import {PostDocumentContent, WikiDocument} from '@type/Document.type';
import {useRouter} from 'next/navigation';
import useAmplitude from '@hooks/useAmplitude';
import {putDocumentClient} from '@apis/client/document';
import {postOrganizationDocumentClient} from '@apis/client/organization';
import {useTrie} from '@store/trie';
import {route} from '@constants/route';

const putDocumentWithOrganizations = async (document: PostDocumentContent) => {
  const savedDocument = await putDocumentClient(document);

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

export const usePutDocument = () => {
  const router = useRouter();
  const updateTitle = useTrie(state => state.updateTitle);
  const {trackDocumentUpdate} = useAmplitude();

  const {mutate, isPending} = useMutation<PostDocumentContent, WikiDocument>({
    mutationFn: putDocumentWithOrganizations,
    onSuccess: document => {
      trackDocumentUpdate(document.title, document.documentUUID);
      // TODO: 문서 제목 업데이트 기능 추가 시 updateTitle에 변경 전 문서 제목을 넣어야 합니다
      updateTitle(document.title, document.title, document.documentUUID, 'CREW');
      router.push(route.goWiki(document.documentUUID));
      router.refresh();
    },
  });

  return {
    putDocument: mutate,
    isPutPending: isPending,
  };
};
