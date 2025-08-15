'use client';

import {URLS} from '@constants/urls';
import useMutation from '@hooks/useMutation';
import {PostDocumentContent, WikiDocument} from '@type/Document.type';
import {useRouter} from 'next/navigation';
import useAmplitude from '@hooks/useAmplitude';
import {putDocumentClient} from '@apis/client/document';
import {useTrie} from '@store/trie';

export const usePutDocument = () => {
  const router = useRouter();
  const trie = useTrie(state => state.trie);
  const {trackDocumentUpdate} = useAmplitude();

  const {mutate, isPending} = useMutation<PostDocumentContent, WikiDocument>({
    mutationFn: putDocumentClient,
    onSuccess: document => {
      trackDocumentUpdate(document.title, document.documentUUID);
      // 문서 제목 업데이트 기능 추가 시 trie.update에 변경 전 문서 제목을 넣어야 합니다
      trie.update(document.title, document.title, document.documentUUID);
      router.push(`${URLS.wiki}/${document.documentUUID}`);
      router.refresh();
    },
  });

  return {
    putDocument: mutate,
    isPutPending: isPending,
  };
};
