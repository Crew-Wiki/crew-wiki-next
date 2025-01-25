'use client';

import {PostDocumentContent} from '@apis/document';
import {URLS} from '@constants/urls';
import useMutation from '@hooks/useMutation';
import {WikiDocument} from '@type/Document.type';
import {requestPost} from '@apis/http';
import {useRouter} from 'next/navigation';

export const usePostDocument = () => {
  const router = useRouter();

  const postDocument = async (document: PostDocumentContent) => {
    const newDocument = await requestPost<WikiDocument>({
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      endpoint: '/api/post-document',
      body: document,
    });

    return newDocument;
  };

  const {mutate, isPending} = useMutation<PostDocumentContent, WikiDocument>({
    mutationFn: postDocument,
    onSuccess: document => {
      router.push(`${URLS.wiki}/${document.title}`);
    },
  });

  return {
    postDocument: mutate,
    isPostPending: isPending,
  };
};
