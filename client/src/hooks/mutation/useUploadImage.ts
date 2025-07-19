'use client';

import {uploadImage} from '@apis/client/images';
import useMutation from '@hooks/useMutation';
import {useDocument} from '@store/document';
import {HookCallback} from '@type/Editor.type';

export type UploadImageArgs = {file: File; callback: HookCallback};

export const useUploadImage = (uuid: string) => {
  const updateImageUploadPending = useDocument(action => action.updateImageUploadPending);

  const {mutate} = useMutation({
    mutationFn: ({file, callback}: UploadImageArgs) => uploadImage(uuid, file),
    onMutate: () => {
      updateImageUploadPending(true);
    },
    onSuccess: (response, {callback}) => {
      callback(response, 'image');
    },
    onError: error => {
      // TODO: 에러처리 alert 대신에 토스트를 보여주는 방식으로 변경
      alert(error);
    },
    onSettled: () => {
      updateImageUploadPending(false);
    },
  });

  return {
    uploadImageAndReplaceUrl: mutate,
  };
};
