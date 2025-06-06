'use client';

import Button from '@components/common/Button';
import DocumentTitle from '@components/document/layout/DocumentTitle';
import {useRouter} from 'next/navigation';
import {useDocumentWriteContext} from '@context/DocumentWriteContext';

const PostHeader = () => {
  const {onSubmit, isPending, canSubmit} = useDocumentWriteContext();
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <header className="flex justify-between w-full">
      <DocumentTitle title="작성하기" />
      <fieldset className="flex gap-2">
        <Button style="tertiary" size="xs" onClick={goBack}>
          취소하기
        </Button>
        <Button style="primary" size="xs" onClick={onSubmit} disabled={isPending || !canSubmit}>
          작성완료
        </Button>
      </fieldset>
    </header>
  );
};

export default PostHeader;
