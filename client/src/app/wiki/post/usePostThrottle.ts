'use client';

import KEYS from '@constants/keys';
import useThrottle from '@hooks/useThrottle';
import {EditorRef} from '@type/Editor.type';
import {mySessionStorage} from '@utils/mySessionStorage';
import {useEffect} from 'react';

type UsePostThrottleArgs = {
  editorRef: EditorRef;
  title?: string;
};

export const usePostThrottle = ({editorRef, title = ''}: UsePostThrottleArgs) => {
  const {makeThrottle, cleanup} = useThrottle();

  useEffect(
    function attachBackupHandler() {
      const MARKDOWN_THROTTLE_TIME = 5000;

      const getMarkDown = (editorRef: EditorRef) => {
        return editorRef.current?.getInstance().getMarkdown();
      };

      const saveMarkDown = () => {
        if (typeof window !== 'undefined') {
          mySessionStorage.set([KEYS.SESSION_STORAGE.WRITE, title], getMarkDown(editorRef) ?? '');
        }
      };
      const saveMarkDownThrottle = makeThrottle(saveMarkDown, MARKDOWN_THROTTLE_TIME);

      if (editorRef.current !== null) {
        editorRef.current.getInstance().addHook('change', saveMarkDownThrottle);
      }
      return cleanup;
    },
    [cleanup, editorRef, makeThrottle, title],
  );

  const initialValue =
    typeof window !== 'undefined' && mySessionStorage.has([KEYS.SESSION_STORAGE.WRITE, title])
      ? (mySessionStorage.get([KEYS.SESSION_STORAGE.WRITE, title]) as string)
      : null;

  return initialValue;
};
