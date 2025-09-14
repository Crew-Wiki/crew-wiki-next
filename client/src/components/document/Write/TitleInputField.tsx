'use client';

import Input from '@components/common/Input';
import {useGetDocumentTitleList} from '@hooks/fetch/useGetDocumentTitleList';
import {useDocument} from '@store/document';
import {usePathname} from 'next/navigation';

const ErrorField = () => {
  const error = useDocument(state => state.errorMessages);

  return (
    <div className="flex w-full justify-between">
      <div className="text-right font-pretendard text-sm text-error-error">{error.title}</div>
      <div className="text-right font-pretendard text-sm text-error-error">{error.writer}</div>
    </div>
  );
};

const TitleInput = () => {
  const pathname = usePathname();
  const title = useDocument(state => state.values.title);
  const error = useDocument(state => state.errorMessages.title);
  const onChange = useDocument(action => action.onChange);
  const onBlur = useDocument(action => action.onBlur);

  const {titles} = useGetDocumentTitleList();

  return (
    <Input
      className="flex h-14 w-full gap-2 rounded-xl border border-solid border-grayscale-200 px-4 py-2.5 font-bm text-2xl max-[768px]:h-10 max-[768px]:text-sm"
      placeholder="문서의 제목을 입력해 주세요"
      input={title}
      handleChangeInput={event => onChange(event.target.value, 'title')}
      maxLength={12}
      disabled={pathname.includes('edit')}
      onBlur={event => onBlur(event.target.value, 'title', titles)}
      invalid={error !== null}
    />
  );
};

const WriterInput = () => {
  const writer = useDocument(state => state.values.writer);
  const error = useDocument(state => state.errorMessages.writer);
  const onChange = useDocument(action => action.onChange);

  return (
    <Input
      className="flex h-14 w-36 gap-2 rounded-xl border border-solid border-grayscale-200 bg-white px-4 py-2.5 font-bm text-2xl max-[768px]:h-10 max-[768px]:text-sm"
      placeholder="편집자"
      input={writer}
      handleChangeInput={event => onChange(event.target.value, 'writer')}
      invalid={error !== null}
    />
  );
};

const TitleInputField = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <ErrorField />
      <div className="flex h-fit w-full gap-6">
        <TitleInput />
        <WriterInput />
      </div>
    </div>
  );
};

export default TitleInputField;
