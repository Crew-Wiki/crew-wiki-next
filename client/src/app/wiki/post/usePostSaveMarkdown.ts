'use client';

import KEYS from '@constants/keys';
import {mySessionStorage} from '@utils/mySessionStorage';
import {useCallback} from 'react';

export const usePostSaveMarkdown = () => {
  const saveMarkdown = useCallback((markdown: string) => {
    if (typeof window !== 'undefined') {
      mySessionStorage.set([KEYS.SESSION_STORAGE.post], markdown);
    }
  }, []);

  const initialValue =
    typeof window !== 'undefined' && mySessionStorage.has([KEYS.SESSION_STORAGE.post])
      ? (mySessionStorage.get([KEYS.SESSION_STORAGE.post]) as string)
      : null;

  return {saveMarkdown, initialValue};
};
