'use client';

import {useEffect, useState} from 'react';
import {useModal} from '@components/common/Modal/useModal';
import {ConflictModal} from './ConflictModal';
import {useDocument} from '@store/document';
import {getDocumentByUUIDClient} from '@apis/client/document';
import {createConflictText} from '@utils/createConflictText';
import {useFetch} from '@hooks/useFetch';

interface ConflictModalProps {
  handleSubmit: (contents: string) => Promise<void>;
}

export const useConflictModal = ({handleSubmit}: ConflictModalProps) => {
  const [conflict, setConflict] = useState<{version: number; content: string}>({
    version: -1,
    content: '',
  });

  const [isResolved, setIsResolved] = useState(false);
  const {refetch: fetchData, isLoading} = useFetch(() => getDocumentByUUIDClient(uuid), {enabled: false});

  useEffect(() => {
    const hasConflictMarkers = /<<<<<|──────────────/.test(conflict.content);
    setIsResolved(!hasConflictMarkers);
  }, [conflict.content]);

  const uuid = useDocument(state => state.uuid);
  const originalVersion = useDocument(state => state.originalVersion);
  const values = useDocument(state => state.values);

  const handleResolve = async (resolvedContent: string) => {
    try {
      // 재충돌 방지
      const newLatest = await fetchData();

      // 충돌 시 새 버전과 새로 불러온 버전이 다르다면 다시 충돌상황
      if (newLatest && conflict.version !== newLatest.latestVersion) {
        modal.closeWithReject('병합하는 동안 새로운 변경사항 발생');
        alert('병합하는 동안 새로운 변경사항이 생겼습니다. 다시 충돌을 해결해주세요.');
        const conflictText = createConflictText(newLatest.contents, resolvedContent);
        setConflict({version: newLatest.latestVersion, content: conflictText});
        modal.open();
        return;
      }

      await handleSubmit(resolvedContent);
      modal.close(true);
    } catch (error) {
      console.error(error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleConflictCheck = async () => {
    try {
      const latest = await fetchData();

      if (latest && originalVersion !== latest.latestVersion) {
        const conflictText = createConflictText(latest.contents, values.contents);
        setConflict({version: latest.latestVersion, content: conflictText});
        modal.open();
      } else {
        await handleSubmit(values.contents);
      }
    } catch (error) {
      console.error(error);
      alert('최신 버전을 확인하는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleSetContent = (value: string) => {
    setConflict(prev => {
      return {
        ...prev,
        content: value,
      };
    });
  };

  const modal = useModal<boolean>(
    <ConflictModal
      initialContent={conflict.content}
      setContent={handleSetContent}
      closeModal={() => modal.close()}
      handleResolve={() => handleResolve(conflict.content)}
      isResolved={isResolved}
    />,
    {closeOnClickDimmedLayer: false},
  );

  return {modal, handleConflictCheck, isLoading};
};
