'use client';

import {usePostViewCount} from '@hooks/mutation/usePostViewCount';
import {useEffect} from 'react';

type IncrementViewCountProps = {
  uuid: string;
};

export const IncrementViewCountByUUID = ({uuid}: IncrementViewCountProps) => {
  const {postViewCount} = usePostViewCount();

  useEffect(() => {
    console.log(uuid);
    if (uuid) postViewCount({uuid});
  }, [uuid]);

  return null;
};
