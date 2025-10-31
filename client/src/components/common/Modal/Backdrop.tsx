'use client';

import {MouseEvent, PropsWithChildren} from 'react';

type BackdropProps = PropsWithChildren<{
  opacity?: number;
  onClick: (event: MouseEvent) => void;
}>;

export const Backdrop = ({children, opacity = 0.32, onClick}: BackdropProps) => {
  return (
    <div
      style={{backgroundColor: `rgba(0, 0, 0, ${opacity})`}}
      className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
