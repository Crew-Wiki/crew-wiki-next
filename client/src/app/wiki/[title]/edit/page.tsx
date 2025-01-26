'use client';

import PostHeader from '@components/document/Write/PostHeader';
import {DocumentWriteContextProvider, useDocumentWriteContext} from '@context/DocumentWriteContext';
import TitleInputField from '@components/document/Write/TitleInputField';
import TuiEditor from '@components/document/TuiEditor';
import {useParams} from 'next/navigation';
import {useGetDocumentByTitle} from '@hooks/fetch/useGetDocumentByTitle';

const EditPage = () => {
  const {contentsProps} = useDocumentWriteContext();

  return (
    <>
      <PostHeader />
      <TitleInputField disabled />
      <TuiEditor initialValue={contentsProps.initialContents ?? null} />
    </>
  );
};

const Page = () => {
  const {title} = useParams();
  const {document} = useGetDocumentByTitle(title as string);

  return (
    document && (
      <DocumentWriteContextProvider mode="edit" title={document.title} contents={document.contents}>
        <EditPage />
      </DocumentWriteContextProvider>
    )
  );
};

export default Page;
