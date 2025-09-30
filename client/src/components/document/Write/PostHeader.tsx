'use client';

import Button from '@components/common/Button';
import DocumentTitle from '@components/document/layout/DocumentTitle';
import {useRouter} from 'next/navigation';
import {Field, useDocument} from '@store/document';
import {getBytes} from '@utils/getBytes';
import {usePostDocument} from '@hooks/mutation/usePostDocument';
import {usePutDocument} from '@hooks/mutation/usePutDocument';
import {PostDocumentContent} from '@type/Document.type';

type ModeProps = {
  mode: 'post' | 'edit';
};

const RequestButton = ({mode}: ModeProps) => {
  const uuid = useDocument(state => state.uuid);
  const values = useDocument(state => state.values);
  const errors = useDocument(state => state.errorMessages);
  const isImageUploadPending = useDocument(state => state.isImageUploadPending);

  const requiredFields: Array<Field> = ['title', 'writer', 'contents'];
  const canSubmit = requiredFields.every(field => values[field].trim() !== '' && errors[field] === null);

  const {postDocument, isPostPending} = usePostDocument();
  const {putDocument, isPutPending} = usePutDocument();
  const isPending = isPostPending || isPutPending || isImageUploadPending;

  const onSubmit = async () => {
    const document: PostDocumentContent = {
      uuid,
      title: values.title,
      contents: values.contents,
      writer: values.writer,
      documentBytes: getBytes(values.contents),
    };

    if (mode === 'post') await postDocument(document);
    if (mode === 'edit') await putDocument(document);
  };

  return (
    <Button style="primary" size="xs" disabled={!canSubmit || isPending} onClick={onSubmit}>
      작성완료
    </Button>
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
