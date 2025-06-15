'use client';

import PostHeader from '@components/document/Write/PostHeader';
import TitleInputField from '@components/document/Write/TitleInputField';

import TuiEditor from '@components/document/TuiEditor';
import {DocumentWriteContextProvider} from '@context/DocumentWriteContext';
import {usePostSaveMarkdown} from './usePostSaveMarkdown';

const PostPage = () => {
  const {saveMarkdown, initialValue} = usePostSaveMarkdown();

  return (
    <section className="flex h-fit w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-[768px]:gap-3 max-[768px]:p-4">
      <PostHeader />
      <TitleInputField />
      <TuiEditor initialValue={initialValue} saveMarkdown={saveMarkdown} />
    </section>
  );
};

const Page = () => {
  return (
    <DocumentWriteContextProvider>
      <PostPage />
    </DocumentWriteContextProvider>
  );
};

export default Page;
