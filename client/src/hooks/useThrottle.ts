'use client';

import {useCallback, useState} from 'react';

const useThrottle = () => {
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const makeThrottle = useCallback(
    (callback: () => void, throttleTime: number) => () => {
      if (timeoutId) return;
      const newTimeoutId = setTimeout(() => {
        callback();
        setTimeoutId(null);
      }, throttleTime);
      setTimeoutId(newTimeoutId);
    },
    [timeoutId],
  );

  const cleanup = useCallback(() => {
    if (!timeoutId) return;
    clearTimeout(timeoutId);
  }, [timeoutId]);

  return {makeThrottle, cleanup};
};

export default useThrottle;
