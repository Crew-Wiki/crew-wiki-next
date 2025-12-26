import {getDocumentByUUIDServer, getDocumentsUUIDServer} from '@apis/server/document';
import DocumentContents from '@components/document/layout/DocumentContents';
import DocumentFooter from '@components/document/layout/DocumentFooter';
import DocumentHeader from '@components/document/layout/DocumentHeader';
import MobileDocumentHeader from '@components/document/layout/MobileDocumentHeader';
import type {UUIDParams} from '@type/PageParams.type';
import {generateDocumentPageMetadata} from '@utils/generateDocumentMetadata';
import markdownToHtml from '@utils/markdownToHtml';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {IncrementViewCountByUUID} from './IncrementViewCountByUUID';

export const dynamicParams = true;

export async function generateStaticParams() {
  const documents = await getDocumentsUUIDServer();
  return documents.map(({uuid}) => ({uuid}));
}

export async function generateMetadata({params}: UUIDParams): Promise<Metadata> {
  const {uuid} = await params;
  return await generateDocumentPageMetadata(uuid);
}

// next.js v15부터 params를 받기 위해 await를 사용해야 함
// https://nextjs.org/docs/messages/sync-dynamic-apis
const DocumentPage = async ({params}: UUIDParams) => {
  const {uuid} = await params;
  const document = await getDocumentByUUIDServer(uuid);

  if (!document) {
    notFound();
  }

  const contents = await markdownToHtml(document.contents);

  return (
    <div className="flex w-full flex-col gap-6 max-[768px]:gap-2">
      <MobileDocumentHeader uuid={document.documentUUID} />
      <section className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:gap-2 max-md:p-4 max-[768px]:gap-2">
        <DocumentHeader title={document.title} uuid={document.documentUUID} />
        <DocumentContents contents={contents} organizations={[]} />
      </section>
      <DocumentFooter generateTime={document.generateTime} />
      <IncrementViewCountByUUID uuid={document.documentUUID} />
    </div>
  );
};

export default DocumentPage;
