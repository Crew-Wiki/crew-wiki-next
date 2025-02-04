'use client';

import {PostDocumentContent} from '@apis/document';
import {URLS} from '@constants/urls';
import useMutation from '@hooks/useMutation';
import {WikiDocument} from '@type/Document.type';
import {requestPut} from '@apis/http';
import {useRouter} from 'next/navigation';
import useAmplitude from '@hooks/useAmplitude';

export const usePutDocument = () => {
  const router = useRouter();
  const {trackDocumentUpdate} = useAmplitude();

  const putDocument = async (document: PostDocumentContent) => {
    const editDocument = await requestPut<WikiDocument>({
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      endpoint: '/api/put-document',
      body: document,
    });

    return editDocument;
  };

  const {mutate, isPending} = useMutation<PostDocumentContent, WikiDocument>({
    mutationFn: putDocument,
    onSuccess: document => {
      trackDocumentUpdate(document.title);
      router.push(`${URLS.wiki}/${document.title}`);
      router.refresh();
    },
  });

  return {
    putDocument: mutate,
    isPutPending: isPending,
  };
};
