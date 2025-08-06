import DocumentContents from '@components/document/layout/DocumentContents';
import DocumentFooter from '@components/document/layout/DocumentFooter';
import DocumentHeader from '@components/document/layout/DocumentHeader';
import MobileDocumentHeader from '@components/document/layout/MobileDocumentHeader';
import type {UUIDParams} from '@type/PageParams.type';
import {getDocumentsMap} from '@utils/documentCache';
import {getDocumentTitleUsingUUID, getDocumentUsingUUID} from '@utils/getDocumentUsingUUIDInCache';
import markdownToHtml from '@utils/markdownToHtml';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {IncrementViewCountByUUID} from './IncrementViewCountByUUID';

export const dynamicParams = true;

export async function generateStaticParams() {
  const documents = await getDocumentsMap();
  return [...documents.values()].map(({uuid}) => ({uuid}));
}

export async function generateMetadata({params}: UUIDParams): Promise<Metadata> {
  const {uuid} = await params;

  try {
    const documentTitle = await getDocumentTitleUsingUUID(uuid);

    return {
      title: documentTitle,
      description: `${documentTitle}에 대한 정보(논란)를 확인하세요.`,
      openGraph: {
        title: `크루위키 ${documentTitle}의 문서`,
        description: `${documentTitle}에 대한 정보(논란)를 확인하세요.`,
        images: `${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/daemoon.png`,
      },
    };
  } catch (error) {
    return {
      title: '크루위키',
      description: '존재하지 않는 문서입니다.',
      openGraph: {
        title: '크루위키',
        description: '존재하지 않는 문서입니다.',
        images: `${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/daemoon.png`,
      },
    };
  }
}

// next.js v15부터 params를 받기 위해 await를 사용해야 함
// https://nextjs.org/docs/messages/sync-dynamic-apis
const DocumentPage = async ({params}: UUIDParams) => {
  const {uuid} = await params;
  const document = await getDocumentUsingUUID(uuid);

  if (!document) {
    notFound();
  }

  const contents = await markdownToHtml(document.contents);

  return (
    <div className="flex w-full flex-col gap-6 max-[768px]:gap-2">
      <MobileDocumentHeader uuid={document.uuid} />
      <section className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:gap-2 max-md:p-4 max-[768px]:gap-2">
        <DocumentHeader title={document.title} uuid={document.uuid} />
        <DocumentContents contents={contents} />
      </section>
      <DocumentFooter generateTime={document.generateTime} />
      <IncrementViewCountByUUID uuid={document.uuid} />
    </div>
  );
};

export default DocumentPage;
