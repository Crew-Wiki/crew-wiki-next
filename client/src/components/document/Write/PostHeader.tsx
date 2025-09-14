'use client';

import Button from '@components/common/Button';
import DocumentTitle from '@components/document/layout/DocumentTitle';
import {useRouter} from 'next/navigation';
import {Field, useDocument} from '@store/document';
import {getBytes} from '@utils/getBytes';
import {usePostDocument} from '@hooks/mutation/usePostDocument';
import {usePutDocument} from '@hooks/mutation/usePutDocument';
import {URLS} from '@constants/urls';
import {PostDocumentContent} from '@type/Document.type';
import {useState} from 'react';
import {getDocumentByUUIDClient} from '@apis/client/document';
import ConflictModal from './ConflictModal';
import {createConflictText} from '@utils/createConflictText';

type ModeProps = {
  mode: 'post' | 'edit';
};

const RequestButton = ({mode}: ModeProps) => {
  const uuid = useDocument(state => state.uuid);
  const values = useDocument(state => state.values);
  const errors = useDocument(state => state.errorMessages);
  const isImageUploadPending = useDocument(state => state.isImageUploadPending);
  const originalVersion = useDocument(state => state.originalVersion);
  const router = useRouter();

  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [conflictContent, setConflictContent] = useState('');

  const requiredFields: Array<Field> = ['title', 'writer', 'contents'];
  const canSubmit = requiredFields.every(field => values[field].trim() !== '' && errors[field] === null);

  const {postDocument, isPostPending} = usePostDocument();
  const {putDocument, isPutPending} = usePutDocument();
  const isPending = isPostPending || isPutPending || isImageUploadPending;

  const handleConflictCheck = async () => {
    try {
      const latestVersion = (await getDocumentByUUIDClient(uuid)).version;

      if (latestVersion && originalVersion !== latestVersion) {
        const remoteDocument = await getDocumentByUUIDClient(uuid);
        const conflictText = createConflictText(remoteDocument.contents, values.contents);
        setConflictContent(conflictText);
        setIsConflictModalOpen(true);
      } else {
        await handleSubmit(values.contents);
      }
    } catch (error) {
      console.error(error);
      alert('최신 버전을 확인하는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleSubmit = async (contents: string) => {
    const document: PostDocumentContent = {
      uuid,
      title: values.title,
      contents,
      writer: values.writer,
      documentBytes: getBytes(contents),
    };

    if (mode === 'post') {
      postDocument(document);
    } else {
      putDocument(document);
    }

    router.push(`${URLS.wiki}/${uuid}`);
    router.refresh();
  };

  const handleResolve = async (resolvedContent: string) => {
    try {
      // 재충돌 방지
      const latestVersion = (await getDocumentByUUIDClient(uuid)).version;

      if (latestVersion && originalVersion !== latestVersion) {
        alert('병합하는 동안 새로운 변경사항이 생겼습니다. 페이지를 새로고침하여 다시 시도해주세요.');
        setIsConflictModalOpen(false);
        router.refresh();
        return;
      }

      await handleSubmit(resolvedContent);
      setIsConflictModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('저장에 실패했습니다.');
    }
  };

  const onSubmit = async () => {
    if (mode === 'edit') {
      await handleConflictCheck();
    } else {
      await handleSubmit(values.contents);
    }
  };

  return (
    <>
      <Button style="primary" size="xs" disabled={!canSubmit || isPending} onClick={onSubmit}>
        작성완료
      </Button>
      {isConflictModalOpen && (
        <ConflictModal
          initialContent={conflictContent}
          onResolve={handleResolve}
          onCancel={() => setIsConflictModalOpen(false)}
        />
      )}
    </>
  );
};

const PostHeader = ({mode}: ModeProps) => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <header className="flex w-full justify-between">
      <DocumentTitle title="작성하기" />
      <fieldset className="flex gap-2">
        <Button type="button" style="tertiary" size="xs" onClick={goBack}>
          취소하기
        </Button>
        <RequestButton mode={mode} />
      </fieldset>
    </header>
  );
};

export default PostHeader;
