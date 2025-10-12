'use client';

import {useCallback, useEffect, useState, type ReactNode, MouseEvent} from 'react';
import {useManualPromise} from './useManualPromise';
import {Overlay} from './Overlay';
import {HideScroll} from './HideScroll';
import {DimmedLayer} from './DimmedLayer';

export type ModalOption = {
  closeOnClickDimmedLayer?: boolean;
  closeOnESCInput?: boolean;
  onClose?: VoidFunction;
};

export const useModal = <T,>(
  modal: ReactNode,
  {closeOnClickDimmedLayer = true, closeOnESCInput = false, onClose}: ModalOption = {},
) => {
  const [showModal, setShowModal] = useState(false);
  const {getPromise, resolve, reject} = useManualPromise<T | undefined>();

  const open = useCallback(async () => {
    setShowModal(true);
    return getPromise();
  }, [getPromise]);

  const close = useCallback(
    (value?: T) => {
      resolve(value);
      onClose?.();
      setShowModal(false);
    },
    [onClose, resolve],
  );

  const closeWithReject = useCallback(
    (message?: string) => {
      reject(new Error(message));
      onClose?.();
      setShowModal(false);
    },
    [onClose, reject],
  );

  const handleClickDimmedLayer = (event: MouseEvent) => {
    event.stopPropagation();
    if (closeOnClickDimmedLayer && event.target === event.currentTarget) {
      close(undefined);
    }
  };

  useEffect(
    function cleanupPromise() {
      return () => resolve(undefined);
    },
    [resolve],
  );

  useEffect(
    function attachESCKeyEvent() {
      if (!closeOnESCInput) return;

      const handleKeyboard = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          close(undefined);
        }
      };

      document.addEventListener('keydown', handleKeyboard);
      return () => document.removeEventListener('keydown', handleKeyboard);
    },
    [closeOnESCInput, close],
  );

  const component = showModal ? (
    <Overlay>
      <HideScroll>
        <DimmedLayer onClick={handleClickDimmedLayer}>{modal}</DimmedLayer>
      </HideScroll>
    </Overlay>
  ) : null;

  return {
    open,
    close,
    closeWithReject,
    component,
    isOpened: showModal,
  } as const;
};
