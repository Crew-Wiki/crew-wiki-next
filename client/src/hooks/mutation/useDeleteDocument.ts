import useMutation from '@hooks/useMutation';
import {requestDeleteClient} from '@http/client';

export const useDeleteDocument = () => {
  const deleteDocument = async (documentId: number) => {
    return await requestDeleteClient<void>({
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      endpoint: '/api/delete-document',
      body: {documentId},
    });
  };

  const {mutate, isPending, errorMessage} = useMutation<number, void>({
    mutationFn: deleteDocument,
    onSuccess: () => {
      alert('문서가 성공적으로 삭제되었습니다.');
    },
    onError: error => {
      if (error instanceof Error) {
        alert(`${error.message}`);
      } else {
        alert('문서 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    },
  });

  return {
    deleteDocument: mutate,
    isDeletePending: isPending,
    errorMessage,
  };
};
