'use client';

import useMutation from '@hooks/useMutation';
import {postViewCount} from '@apis/client/viewCount';

type Argument = {uuid: string};
type Response = {message: string};

export const usePostViewCount = () => {
  const {mutate, ...rest} = useMutation<Argument, Response>({
    mutationFn: ({uuid}: Argument) => postViewCount(uuid),
  });

  return {
    postViewCount: mutate,
    ...rest,
  };
};
