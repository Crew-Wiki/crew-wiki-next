import React from 'react';
import Input from '@components/Input';
import {useDocumentWriteContextProvider} from '../../context/DocumentWriteContext';

type TitleInputField = {
  disabled?: boolean;
};

const TitleInputField = ({disabled = false}: TitleInputField) => {
  const {title, titleErrorMessage, onTitleChange, onTitleBlur, nickname, nicknameErrorMessage, onNicknameChange} =
    useDocumentWriteContextProvider();

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex w-full justify-between">
        <div className="font-pretendard text-error-error text-sm text-right">{titleErrorMessage}</div>
        <div className="font-pretendard text-error-error text-sm text-right">{nicknameErrorMessage}</div>
      </div>
      <div className="flex gap-6 w-full h-fit">
        <Input
          className="flex h-14 px-4 py-2.5 rounded-xl border-grayscale-200 border-solid border gap-2 max-[768px]:h-10 font-bm text-2xl max-[768px]:text-sm"
          placeholder="문서의 제목을 입력해 주세요"
          input={title}
          handleChangeInput={onTitleChange}
          maxLength={12}
          disabled={disabled}
          onBlur={onTitleBlur}
          invalid={titleErrorMessage !== null}
        />
        <Input
          className="flex w-36 h-14 px-4 py-2.5 rounded-xl bg-white border-grayscale-200 border-solid border gap-2 max-[768px]:h-10 font-bm text-2xl max-[768px]:text-sm"
          placeholder="편집자"
          input={nickname}
          handleChangeInput={onNicknameChange}
          invalid={nicknameErrorMessage !== null}
        />
      </div>
    </div>
  );
};

export default TitleInputField;
