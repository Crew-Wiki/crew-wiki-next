'use client';

import useMutation from '@hooks/useMutation';
import {PostDocumentContent, WikiDocument} from '@type/Document.type';
import useAmplitude from '@hooks/useAmplitude';
import {putDocumentClient} from '@apis/client/document';
import {useTrie} from '@store/trie';
import {route} from '@constants/route';

export const usePutDocument = () => {
  const updateTitle = useTrie(state => state.updateTitle);
  const {trackDocumentUpdate} = useAmplitude();

  const {mutate, isPending} = useMutation<PostDocumentContent, WikiDocument>({
    mutationFn: putDocumentClient,
    onSuccess: document => {
      trackDocumentUpdate(document.title, document.documentUUID);
      // TODO: 문서 제목 업데이트 기능 추가 시 updateTitle에 변경 전 문서 제목을 넣어야 합니다
      updateTitle(document.title, document.title, document.documentUUID);
      window.location.href = route.goWiki(document.documentUUID);
    },
  });

  return {
    putDocument: mutate,
    isPutPending: isPending,
  };
};
