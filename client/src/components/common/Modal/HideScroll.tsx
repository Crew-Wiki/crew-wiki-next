'use client';

import {PropsWithChildren, useEffect} from 'react';

export const HideScroll = ({children}: PropsWithChildren) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return <>{children}</>;
};
