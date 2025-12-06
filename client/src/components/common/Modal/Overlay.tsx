'use client';

import {PropsWithChildren, useEffect} from 'react';
import {createPortal} from 'react-dom';

type OverlayProps = PropsWithChildren;

export const Overlay = ({children}: OverlayProps) => {
  const target = document.getElementById('modal-root');

  useEffect(() => {
    document.body.classList.add('modal-open');

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  if (!target) {
    return null;
  }

  return createPortal(children, target);
};
