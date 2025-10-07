import {Modal} from '@components/common/Modal/Modal';
import TuiEditor from '../TuiEditor';
import Button from '@components/common/Button';
import {Dispatch, SetStateAction} from 'react';

type ConflictModalProps = {
  initialContent: string;
  setContent: Dispatch<SetStateAction<string>>;
  closeModal: VoidFunction;
  handleResolve: VoidFunction;
  isResolved: boolean;
};

export const ConflictModal = ({
  initialContent,
  setContent,
  closeModal,
  handleResolve,
  isResolved,
}: ConflictModalProps) => {
  return (
    <Modal>
      <h2 className="mb-4 text-2xl font-bold">문서 충돌 해결</h2>
      <p className="mb-4">다른 사용자가 문서를 수정했습니다. 아래 내용을 병합하여 저장해주세요.</p>
      <div className="mb-4">
        <TuiEditor initialValue={initialContent} onChange={setContent} />
      </div>
      <div className="flex justify-end gap-2">
        <Button style="tertiary" size="m" onClick={closeModal}>
          취소
        </Button>
        <Button style="primary" size="m" onClick={handleResolve} disabled={!isResolved}>
          충돌 해결 완료
        </Button>
      </div>
    </Modal>
  );
};
