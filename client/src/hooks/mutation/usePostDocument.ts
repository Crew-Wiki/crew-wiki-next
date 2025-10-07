'use client';

import {URLS} from '@constants/urls';
import useMutation from '@hooks/useMutation';
import {PostDocumentContent, WikiDocument} from '@type/Document.type';
import {useRouter} from 'next/navigation';
import useAmplitude from '@hooks/useAmplitude';
import {postDocumentClient} from '@apis/client/document';
import {useTrie} from '@store/trie';

export const usePostDocument = () => {
  const router = useRouter();
  const addTitle = useTrie(state => state.addTitle);
  const {trackDocumentCreate} = useAmplitude();

  const {mutate, isPending} = useMutation<PostDocumentContent, WikiDocument>({
    mutationFn: postDocumentClient,
    onSuccess: document => {
      trackDocumentCreate(document.title, document.documentUUID);
      addTitle(document.title, document.documentUUID);
      router.push(`${URLS.wiki}/${document.documentUUID}`);
      router.refresh();
    },
  });

  return {
    postDocument: mutate,
    isPostPending: isPending,
  };
};
