'use client';

import Button from '@components/common/Button';
import DocumentTitle from '@components/document/layout/DocumentTitle';
import {useRouter} from 'next/navigation';
import {Field, useDocument} from '@store/document';
import {getBytes} from '@utils/getBytes';
import {usePostDocument} from '@hooks/mutation/usePostDocument';
import {usePutDocument} from '@hooks/mutation/usePutDocument';
import {PostDocumentContent} from '@type/Document.type';
import {useConflictModal} from './useConflictModal';
import {ModeProps} from './type';

const RequestButton = ({mode}: ModeProps) => {
  const uuid = useDocument(state => state.uuid);
  const values = useDocument(state => state.values);
  const errors = useDocument(state => state.errorMessages);
  const isImageUploadPending = useDocument(state => state.isImageUploadPending);

  const requiredFields: Array<Field> = ['title', 'writer', 'contents'];
  const canSubmit = requiredFields.every(field => values[field].trim() !== '' && errors[field] === null);

  const {postDocument, isPostPending} = usePostDocument();
  const {putDocument, isPutPending} = usePutDocument();

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
  };

  const {
    modal: conflictModal,
    handleConflictCheck,
    isLoading: isLoadingGetLatestDocumentData,
  } = useConflictModal({
    handleSubmit,
  });

  const onSubmit = async () => {
    if (mode === 'edit') {
      await handleConflictCheck();
    } else {
      await handleSubmit(values.contents);
    }
  };

  const isPending = isPostPending || isPutPending || isImageUploadPending || isLoadingGetLatestDocumentData;

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
