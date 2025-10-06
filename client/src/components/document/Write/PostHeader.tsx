'use client';

import Button from '@components/common/Button';
import DocumentTitle from '@components/document/layout/DocumentTitle';
import {useRouter} from 'next/navigation';
import {Field, useDocument} from '@store/document';
import {getBytes} from '@utils/getBytes';
import {usePostDocument} from '@hooks/mutation/usePostDocument';
import {usePutDocument} from '@hooks/mutation/usePutDocument';
import {PostDocumentContent} from '@type/Document.type';
import {useState} from 'react';
import {getDocumentByUUIDClient} from '@apis/client/document';
import {useConflictModal} from './useConflictModal';
import {createConflictText} from '@utils/createConflictText';
import {URLS} from '@constants/urls';
import {ModeProps} from './type';

const RequestButton = ({mode}: ModeProps) => {
  const uuid = useDocument(state => state.uuid);
  const values = useDocument(state => state.values);
  const errors = useDocument(state => state.errorMessages);
  const isImageUploadPending = useDocument(state => state.isImageUploadPending);
  const originalVersion = useDocument(state => state.originalVersion);
  const router = useRouter();

  const [conflict, setConflict] = useState<{version: number; content: string}>({
    version: -1,
    content: '',
  });

  const requiredFields: Array<Field> = ['title', 'writer', 'contents'];
  const canSubmit = requiredFields.every(field => values[field].trim() !== '' && errors[field] === null);

  const handleResolve = async (resolvedContent: string) => {
    try {
      // 재충돌 방지
      const newLatest = await getDocumentByUUIDClient(uuid);

      // 충돌 시 새 버전과 새로 불러온 버전이 다르다면 다시 충돌상황
      if (newLatest && conflict.version !== newLatest.latestVersion) {
        conflictModal.closeWithReject();
        alert('병합하는 동안 새로운 변경사항이 생겼습니다. 다시 충돌을 해결해주세요.');
        const conflictText = createConflictText(newLatest.contents, resolvedContent);
        setConflict({version: newLatest.latestVersion, content: conflictText});
        conflictModal.open();
        return;
      }

      await handleSubmit(resolvedContent);
      conflictModal.close(true);
    } catch (error) {
      console.error(error);
      alert('저장에 실패했습니다.');
    }
  };

  const conflictModal = useConflictModal({
    initialContent: conflict.content,
    onResolve: handleResolve,
  });

  const {postDocument, isPostPending} = usePostDocument();
  const {putDocument, isPutPending} = usePutDocument();
  const isPending = isPostPending || isPutPending || isImageUploadPending;

  const handleConflictCheck = async () => {
    try {
      const latest = await getDocumentByUUIDClient(uuid);

      if (latest && originalVersion !== latest.latestVersion) {
        const conflictText = createConflictText(latest.contents, values.contents);
        setConflict({version: latest.latestVersion, content: conflictText});
        conflictModal.open();
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
      {conflictModal.component}
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
