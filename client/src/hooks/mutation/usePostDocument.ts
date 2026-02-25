'use client';

import useMutation from '@hooks/useMutation';
import {PostDocumentContent, WikiDocument} from '@type/Document.type';
import useAmplitude from '@hooks/useAmplitude';
import {postDocumentClient} from '@apis/client/document';
import {useTrie} from '@store/trie';
import {route} from '@constants/route';

export const usePostDocument = () => {
  const addTitle = useTrie(state => state.addTitle);
  const {trackDocumentCreate} = useAmplitude();

  const {mutate, isPending} = useMutation<PostDocumentContent, WikiDocument>({
    mutationFn: postDocumentClient,
    onSuccess: document => {
      trackDocumentCreate(document.title, document.documentUUID);
      addTitle(document.title, document.documentUUID);
      window.location.href = route.goWiki(document.documentUUID);
    },
  });

  return {
    postDocument: mutate,
    isPostPending: isPending,
  };
};
