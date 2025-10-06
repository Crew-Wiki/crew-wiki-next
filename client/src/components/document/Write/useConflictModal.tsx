'use client';

import Button from '@components/common/Button';
import TuiEditor from '@components/document/TuiEditor';
import {useEffect, useState} from 'react';
import {Modal} from '@components/common/Modal/Modal';
import {useModal} from '@components/common/Modal/useModal';

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
    <Modal>
      <h2 className="mb-4 text-2xl font-bold">문서 충돌 해결</h2>
      <p className="mb-4">다른 사용자가 문서를 수정했습니다. 아래 내용을 병합하여 저장해주세요.</p>
      <div className="mb-4">
        <TuiEditor initialValue={initialContent} onChange={setContent} />
      </div>
      <div className="flex justify-end gap-2">
        <Button style="tertiary" size="m" onClick={() => modal.close()}>
          취소
        </Button>
        <Button style="primary" size="m" onClick={handleResolve} disabled={!isResolved}>
          충돌 해결 완료
        </Button>
      </div>
    </Modal>,
    {closeOnClickDimmedLayer: false},
  );

  return modal;
};
