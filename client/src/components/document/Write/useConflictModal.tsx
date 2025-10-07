'use client';

import {useEffect, useState} from 'react';
import {useModal} from '@components/common/Modal/useModal';
import {ConflictModal} from './ConflictModal';

interface ConflictModalProps {
  initialContent: string;
  onResolve: (resolvedContent: string) => void;
}

export const useConflictModal = ({initialContent, onResolve}: ConflictModalProps) => {
  const [content, setContent] = useState('');
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    const hasConflictMarkers = /<<<<<|──────────────/.test(content);
    setIsResolved(!hasConflictMarkers);
  }, [content]);

  const handleResolve = () => {
    onResolve(content);
    modal.close();
  };

  const modal = useModal<boolean>(
    <ConflictModal
      initialContent={initialContent}
      setContent={setContent}
      closeModal={() => modal.close()}
      handleResolve={handleResolve}
      isResolved={isResolved}
    />,
    {closeOnClickDimmedLayer: false},
  );

  return modal;
};
