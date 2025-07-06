'use client';

import {PostDocumentContent} from '@apis/document';
import {URLS} from '@constants/urls';
import useMutation from '@hooks/useMutation';
import {WikiDocument} from '@type/Document.type';
import {requestPostServer} from '@http/server';
import {useRouter} from 'next/navigation';
import useAmplitude from '@hooks/useAmplitude';

export const usePostDocument = () => {
  const router = useRouter();
  const {trackDocumentCreate} = useAmplitude();

  const postDocument = async (document: PostDocumentContent) => {
    const newDocument = await requestPostServer<WikiDocument>({
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      endpoint: '/api/post-document',
      body: document,
    });

    return newDocument;
  };

  const {mutate, isPending} = useMutation<PostDocumentContent, WikiDocument>({
    mutationFn: postDocument,
    onSuccess: document => {
      trackDocumentCreate(document.title, document.documentUUID);
      router.push(`${URLS.wiki}/${document.documentUUID}`);
    },
  });

  return {
    postDocument: mutate,
    isPostPending: isPending,
  };
};
