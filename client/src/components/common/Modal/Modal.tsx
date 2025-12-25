'use client';

import {PropsWithChildren} from 'react';
import {twMerge} from 'tailwind-merge';

type ModalProps = PropsWithChildren<{
  className?: string;
}>;

export const Modal = ({children, className}: ModalProps) => {
  return (
    <div
      className={twMerge(
        'flex flex-col rounded-xl border border-solid border-primary-100 bg-white px-6 py-8',
        className,
      )}
    >
      {children}
    </div>
  );
};
