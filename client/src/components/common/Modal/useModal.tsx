'use client';

import {useCallback, useEffect, useState, type ReactNode, MouseEvent} from 'react';
import {useManualPromise} from './useManualPromise';
import {Overlay} from './Overlay';
import {HideScroll} from './HideScroll';
import {DimmedLayer} from './DimmedLayer';

export type ModalOption = {
  closeOnClickDimmedLayer?: boolean;
  onClose?: VoidFunction;
};

export const useModal = <T,>(modal: ReactNode, {closeOnClickDimmedLayer = true, onClose}: ModalOption = {}) => {
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

  useEffect(() => {
    return () => reject(new Error('Modal unmounted'));
  }, [reject]);

  const component = showModal ? (
    <Overlay>
      <HideScroll>
        <DimmedLayer
          onClick={(event: MouseEvent) => {
            event.stopPropagation();
            if (closeOnClickDimmedLayer && event.target === event.currentTarget) {
              close(undefined);
            }
          }}
        >
          {modal}
        </DimmedLayer>
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
