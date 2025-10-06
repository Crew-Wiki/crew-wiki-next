'use client';

import PostHeader from '@components/document/Write/PostHeader';
import TitleInputField from '@components/document/Write/TitleInputField';
import TuiEditor from '@components/document/TuiEditor';
import {useParams} from 'next/navigation';
import {act, useEffect} from 'react';
import {useDocument} from '@store/document';
import {LatestWikiDocument} from '@type/Document.type';
import {useGetLatestDocumentByUUID} from '@hooks/fetch/useGetLatestDocumentByUUID';

type EditPageProps = {
  document: LatestWikiDocument;
};

const EditPage = ({document}: EditPageProps) => {
  const setInit = useDocument(action => action.setInit);
  const reset = useDocument(action => action.reset);
  const onChange = useDocument(action => action.onChange);

  useEffect(() => {
    setInit(
      {
        title: document.title,
        writer: document.writer,
        contents: document.contents,
      },
      document.documentUUID,
      document.latestVersion,
    );

    return () => reset();
  }, [document, setInit, reset]);

  return (
    <section className="flex h-fit w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-[768px]:gap-3 max-[768px]:p-4">
      <PostHeader mode="edit" />
      <TitleInputField />
      <TuiEditor initialValue={document.contents} onChange={value => onChange(value, 'contents')} />
    </section>
  );
};

const Page = () => {
  const {uuid} = useParams();
  const {document} = useGetLatestDocumentByUUID(uuid as string); // 최신의 데이터를 불러와야하기 때문에 캐시 데이터 사용하지 않음.

  return document && <EditPage document={document} />;
};

export default Page;
