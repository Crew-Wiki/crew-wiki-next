'use client';

import {usePostViewCount} from '@hooks/mutation/usePostViewCount';
import {useEffect} from 'react';

type IncrementViewCountProps = {
  uuid: string;
};

export const IncrementViewCountByUUID = ({uuid}: IncrementViewCountProps) => {
  const {postViewCount} = usePostViewCount();

  useEffect(() => {
    if (uuid) postViewCount({uuid});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  return null;
};
