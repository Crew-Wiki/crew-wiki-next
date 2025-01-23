'use client';

// https://velog.io/@dea8307/React-useDebounce-Hook-%EC%82%AC%EC%9A%A9%EA%B8%B0
import {useCallback, useRef} from 'react';

const useDebounce = (callback: () => void, term: number) => {
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  const dispatchDebounce = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    const newTimer = setTimeout(() => {
      callback();
    }, term);
    timer.current = newTimer;
  }, [callback, term]);

  return dispatchDebounce;
};

export default useDebounce;
