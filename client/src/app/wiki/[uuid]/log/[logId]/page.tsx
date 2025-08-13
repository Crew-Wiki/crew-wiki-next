import {getSpecificDocumentLogServer} from '@apis/server/document';
import DocumentContents from '@components/document/layout/DocumentContents';
import DocumentFooter from '@components/document/layout/DocumentFooter';
import DocumentHeader from '@components/document/layout/DocumentHeader';
import MobileDocumentHeader from '@components/document/layout/MobileDocumentHeader';
import type {UUIDLogParams} from '@type/PageParams.type';
import {generateLogPageMetadata} from '@utils/generateDocumentMetadata';
import markdownToHtml from '@utils/markdownToHtml';
import {Metadata} from 'next';

export async function generateMetadata({params}: UUIDLogParams): Promise<Metadata> {
  const {uuid} = await params;
  return await generateLogPageMetadata(uuid);
}

const Page = async ({params}: UUIDLogParams) => {
  const {uuid, logId} = await params;
  const document = await getSpecificDocumentLogServer(Number(logId));
  const contents = await markdownToHtml(document.contents);

  return (
    <section className="flex w-full flex-col items-center gap-6">
      <MobileDocumentHeader uuid={uuid} />
      <div className="flex h-fit w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-[768px]:gap-2 max-[768px]:p-4">
        <DocumentHeader title={document.title} uuid={uuid} />
        <DocumentContents contents={contents} />
      </div>
      <DocumentFooter generateTime={document.generateTime} />
    </section>
  );
};

export default Page;
