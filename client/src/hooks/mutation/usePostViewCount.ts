'use client';

import useMutation from '@hooks/useMutation';
import {postViewCount} from '@apis/client/viewCount';
import {useCallback} from 'react';

type Argument = {uuid: string};
type Response = {message: string};

export const usePostViewCount = () => {
  const {mutate, ...rest} = useMutation<Argument, Response>({
    mutationFn: ({uuid}: Argument) => postViewCount(uuid),
  });

  const postViewCountCallback = useCallback(
    (arg: Argument) => {
      mutate(arg);
    },
    [mutate],
  );

  return {
    postViewCount: postViewCountCallback,
    ...rest,
  };
};
