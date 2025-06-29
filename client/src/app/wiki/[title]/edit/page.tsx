'use client';

import PostHeader from '@components/document/Write/PostHeader';
import TitleInputField from '@components/document/Write/TitleInputField';
import TuiEditor from '@components/document/TuiEditor';
import {useParams} from 'next/navigation';
import {useGetDocumentByTitle} from '@hooks/fetch/useGetDocumentByTitle';
import {useEffect} from 'react';
import {useDocument} from '@store/document';
import {WikiDocument} from '@type/Document.type';

type EditPageProps = {
  document: WikiDocument;
};

const EditPage = ({document}: EditPageProps) => {
  const setInit = useDocument(action => action.setInit);
  const reset = useDocument(action => action.reset);

  useEffect(() => {
    setInit({
      title: document.title,
      writer: document.writer,
      contents: document.contents,
      images: [],
    });

    return () => reset();
  }, [document, setInit, reset]);

  return (
    <section className="flex h-fit w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-[768px]:gap-3 max-[768px]:p-4">
      <PostHeader mode="edit" />
      <TitleInputField />
      <TuiEditor initialValue={document.contents} />
    </section>
  );
};

const Page = () => {
  const {title} = useParams();
  const {document} = useGetDocumentByTitle(title as string);

  return document && <EditPage document={document} />;
};

export default Page;
