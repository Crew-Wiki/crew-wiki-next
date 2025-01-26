'use client';

import Input from '@components/common/Input';
import {useDocumentWriteContext} from '@context/DocumentWriteContext';
import useSearchDocumentByQuery from '@hooks/fetch/useSearchDocumentByQuery';

type TitleInputField = {
  disabled?: boolean;
};

const TitleInputField = ({disabled = false}: TitleInputField) => {
  const {titleProps, writerProps} = useDocumentWriteContext();
  const {title, onTitleChange, onTitleBlur, titleErrorMessage} = titleProps;
  const {writer, onWriterChange, writerErrorMessage} = writerProps;

  const {titles} = useSearchDocumentByQuery('', {enabled: true});

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex w-full justify-between">
        <div className="font-pretendard text-error-error text-sm text-right">{titleErrorMessage}</div>
        <div className="font-pretendard text-error-error text-sm text-right">{writerErrorMessage}</div>
      </div>
      <div className="flex gap-6 w-full h-fit">
        <Input
          className="flex h-14 px-4 py-2.5 rounded-xl border-grayscale-200 border-solid border gap-2 max-[768px]:h-10 font-bm text-2xl max-[768px]:text-sm"
          placeholder="문서의 제목을 입력해 주세요"
          input={title}
          handleChangeInput={onTitleChange}
          maxLength={12}
          disabled={disabled}
          onBlur={event => onTitleBlur(event, titles)}
          invalid={titleErrorMessage !== null}
        />
        <Input
          className="flex w-36 h-14 px-4 py-2.5 rounded-xl bg-white border-grayscale-200 border-solid border gap-2 max-[768px]:h-10 font-bm text-2xl max-[768px]:text-sm"
          placeholder="편집자"
          input={writer}
          handleChangeInput={onWriterChange}
          invalid={writerErrorMessage !== null}
        />
      </div>
    </div>
  );
};

export default TitleInputField;
