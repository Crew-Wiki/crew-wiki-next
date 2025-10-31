'use client';

import {useCallback, useRef} from 'react';
import {ManualPromise} from './ManualPromise';

export const useManualPromise = <T = void>() => {
  const promiseRef = useRef<ManualPromise<T> | null>(null);

  const cancelPreviousPromise = useCallback(() => {
    if (promiseRef.current) {
      promiseRef.current.reject?.(new Error('이전 promise가 취소되었습니다.'));
      promiseRef.current = null;
    }
  }, []);

  const createNewPromise = useCallback(() => {
    promiseRef.current = new ManualPromise<T>();
    return promiseRef.current.promise;
  }, []);

  const getPromise = useCallback(() => {
    cancelPreviousPromise();
    return createNewPromise();
  }, [cancelPreviousPromise, createNewPromise]);

  const resolve = useCallback((value: T) => {
    if (promiseRef.current) {
      promiseRef.current.resolve?.(value);
    }
  }, []);

  const reject = useCallback((reason?: Error) => {
    if (promiseRef.current) {
      promiseRef.current.reject?.(reason);
    }
  }, []);

  return {
    getPromise,
    resolve,
    reject,
  };
};
