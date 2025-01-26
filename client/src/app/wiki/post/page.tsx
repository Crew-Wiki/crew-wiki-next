'use client';

import PostHeader from '@components/document/Write/PostHeader';
import TitleInputField from '@components/document/Write/TitleInputField';

import TuiEditor from '@components/document/TuiEditor';
import {DocumentWriteContextProvider} from '@context/DocumentWriteContext';
import {usePostSaveMarkdown} from './usePostSaveMarkdown';

const PostPage = () => {
  const {saveMarkdown, initialValue} = usePostSaveMarkdown();

  return (
    <section className="flex flex-col gap-6 w-full h-fit bg-white border-primary-100 border-solid border rounded-xl p-8 max-[768px]:p-4 max-[768px]:gap-3">
      <PostHeader />
      <TitleInputField />
      <TuiEditor initialValue={initialValue} saveMarkdown={saveMarkdown} />
    </section>
  );
};

const Page = () => {
  return (
    <DocumentWriteContextProvider mode="post">
      <PostPage />
    </DocumentWriteContextProvider>
  );
};

export default Page;
