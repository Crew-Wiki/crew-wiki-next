'use client';

import PostHeader from '@components/Write/PostHeader';
import {DocumentWriteContextProvider, useDocumentWriteContextProvider} from '../../../../context/DocumentWriteContext';
import TitleInputField from '@components/Write/TitleInputField';
import TuiEditor from '@components/MarkdownEditor';
import RelativeSearchTerms from '@components/Write/RelativeSearchTerms';
import {useParams} from 'next/navigation';
import {useRelativeSearchTerms} from '@app/wiki/post/useRelativeSearchTerms';
import {useGetDocumentByTitle} from '@hooks/fetch/useGetDocumentByTitle';

const EditPage = () => {
  const {editorRef, initialContents} = useDocumentWriteContextProvider();
  const {top, left, titles, onClick, showRelativeSearchTerms} = useRelativeSearchTerms({editorRef});

  return (
    <>
      <PostHeader />
      <TitleInputField disabled />
      <TuiEditor initialValue={initialContents ?? null} />
      <RelativeSearchTerms
        showRelativeSearchTerms={showRelativeSearchTerms}
        style={{top: `${top + 200}px`, left, width: 320}}
        searchTerms={titles ?? []}
        onClick={onClick}
      />
    </>
  );
};

const Page = () => {
  const {title} = useParams();
  const {document} = useGetDocumentByTitle(title as string);

  return (
    document && (
      <DocumentWriteContextProvider
        mode="edit"
        title={document.title}
        writer={document.writer}
        contents={document.contents}
      >
        <EditPage />
      </DocumentWriteContextProvider>
    )
  );
};

export default Page;
