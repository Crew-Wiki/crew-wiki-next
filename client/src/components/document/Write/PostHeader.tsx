'use client';

import Button from '@components/common/Button';
import DocumentTitle from '@components/document/layout/DocumentTitle';
import {useRouter} from 'next/navigation';
import {ExcludeImages, useDocument} from '@store/document';
import {uploadImages} from '@apis/client/images';
import {replaceLocalUrlToS3Url} from '@utils/replaceLocalUrlToS3Url';
import {getBytes} from '@utils/getBytes';
import {usePostDocument} from '@hooks/mutation/usePostDocument';
import {usePutDocument} from '@hooks/mutation/usePutDocument';
import {URLS} from '@constants/urls';
import {PostDocumentContent} from '@type/Document.type';

type ModeProps = {
  mode: 'post' | 'edit';
};

const RequestButton = ({mode}: ModeProps) => {
  const documentUUID = useDocument(state => state.uuid);
  const values = useDocument(state => state.values);
  const errors = useDocument(state => state.errorMessages);
  const router = useRouter();

  const requiredFields: Array<ExcludeImages> = ['title', 'writer', 'contents'];
  const canSubmit = requiredFields.every(field => values[field].trim() !== '' && errors[field] === null);

  const {postDocument, isPostPending} = usePostDocument();
  const {putDocument, isPutPending} = usePutDocument();
  const isPending = isPostPending || isPutPending;
  const uuid = documentUUID ?? crypto.randomUUID();

  const onSubmit = async () => {
    const newMetaList = await uploadImages({documentUUID: uuid, uploadImageMetaList: values.images});
    const linkReplacedContents = replaceLocalUrlToS3Url(values.contents, newMetaList);

    const document: PostDocumentContent = {
      uuid,
      title: values.title,
      contents: linkReplacedContents,
      writer: values.writer,
      documentBytes: getBytes(linkReplacedContents),
    };

    if (mode === 'post') postDocument(document);
    if (mode === 'edit') putDocument(document);

    router.push(`${URLS.wiki}/${uuid}`);
    router.refresh();
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
