'use client';

import PostHeader from '@components/document/Write/PostHeader';
import TitleInputField from '@components/document/Write/TitleInputField';
import {DocumentWriteContextProvider, useDocumentWriteContext} from '@context/DocumentWriteContext';
import {usePostThrottle} from './usePostThrottle';
import RelativeSearchTerms from '@components/common/SearchTerms/RelativeSearchTerms';

import {useRelativeSearchTerms} from './useRelativeSearchTerms';
import TuiEditor from '@components/document/MarkdownEditor';

const PostPage = () => {
  const {title, editorRef} = useDocumentWriteContext();
  const initialValue = usePostThrottle({
    editorRef,
    title,
  }); // 세션 스토리지에 저장하는 기능 작동하지 않음...

  const {top, left, titles, onClick, showRelativeSearchTerms} = useRelativeSearchTerms({editorRef});

  return (
    <section className="flex flex-col gap-6 w-full h-fit bg-white border-primary-100 border-solid border rounded-xl p-8 max-[768px]:p-4 max-[768px]:gap-3">
      <PostHeader />
      <TitleInputField />
      <TuiEditor initialValue={initialValue} />
      <RelativeSearchTerms
        showRelativeSearchTerms={showRelativeSearchTerms}
        style={{top: `${top + 200}px`, left, width: 320}}
        searchTerms={titles ?? []}
        onClick={onClick}
      />
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
