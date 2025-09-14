'use client';

import {createPortal} from 'react-dom';
import Button from '@components/common/Button';
import TuiEditor from '@components/document/TuiEditor';
import {useEffect, useState} from 'react';

interface ConflictModalProps {
  initialContent: string;
  onResolve: (resolvedContent: string) => void;
  onCancel: () => void;
}

const ConflictModal = ({initialContent, onResolve, onCancel}: ConflictModalProps) => {
  const [content, setContent] = useState(initialContent);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    const hasConflictMarkers = /<<<<<|>>>>>|=====/.test(content);
    setIsResolved(!hasConflictMarkers);
  }, [content]);

  const handleResolve = () => {
    onResolve(content);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-3/4 max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">문서 충돌 해결</h2>
        <p className="mb-4">다른 사용자가 문서를 수정했습니다. 아래 내용을 병합하여 저장해주세요.</p>
        <div className="mb-4">
          <TuiEditor initialValue={content} onChange={setContent} />
        </div>
        <div className="flex justify-end gap-2">
          <Button style="tertiary" size="m" onClick={onCancel}>
            취소
          </Button>
          <Button style="primary" size="m" onClick={handleResolve} disabled={!isResolved}>
            충돌 해결 완료
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConflictModal;
