'use client';

import {URLS} from '@constants/urls';
import useMutation from '@hooks/useMutation';
import {PostDocumentContent, WikiDocument} from '@type/Document.type';
import {useRouter} from 'next/navigation';
import useAmplitude from '@hooks/useAmplitude';
import {putDocumentClient} from '@apis/client/document';

export const usePutDocument = () => {
  const router = useRouter();
  const {trackDocumentUpdate} = useAmplitude();

  const {mutate, isPending} = useMutation<PostDocumentContent, WikiDocument>({
    mutationFn: putDocumentClient,
    onSuccess: document => {
      trackDocumentUpdate(document.title, document.documentUUID);
      router.push(`${URLS.wiki}/${document.documentUUID}`);
      router.refresh();
    },
  });

  return {
    putDocument: mutate,
    isPutPending: isPending,
  };
};
