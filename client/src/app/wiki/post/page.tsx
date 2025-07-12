'use client';

import PostHeader from '@components/document/Write/PostHeader';
import TitleInputField from '@components/document/Write/TitleInputField';

import TuiEditor from '@components/document/TuiEditor';
import {usePostSaveMarkdown} from './usePostSaveMarkdown';
import {useEffect} from 'react';
import {useDocument} from '@store/document';

const Page = () => {
  const {saveMarkdown, initialValue} = usePostSaveMarkdown();
  const setInit = useDocument(action => action.setInit);
  const reset = useDocument(action => action.reset);

  useEffect(() => {
    setInit(
      {
        title: '',
        writer: '',
        contents: initialValue,
      },
      null,
    );

    return () => reset();
  }, [setInit, initialValue, reset]);

  return (
    <section className="flex h-fit w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-[768px]:gap-3 max-[768px]:p-4">
      <PostHeader mode="post" />
      <TitleInputField />
      <TuiEditor initialValue={initialValue} saveMarkdown={saveMarkdown} />
    </section>
  );
};

export default Page;
