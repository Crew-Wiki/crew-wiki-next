'use client';

import {PropsWithChildren} from 'react';

type ModalProps = PropsWithChildren;

export const Modal = ({children}: ModalProps) => {
  return (
    <div className="flex flex-col rounded-xl border border-solid border-primary-100 bg-white px-6 py-8">{children}</div>
  );
};
