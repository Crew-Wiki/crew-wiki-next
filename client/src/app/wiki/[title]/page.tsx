import {getDocumentByTitle, getRecentlyDocuments} from '@api/document';
import DocumentContents from '@components/Document/DocumentContents';
import DocumentFooter from '@components/Document/DocumentFooter';
import DocumentHeader from '@components/Document/DocumentHeader';
import {CACHE} from '@constants/cache';

interface Props {
  params: {title: string};
}

export const revalidate = CACHE.time.revalidate;

export const dynamicParams = true;

export async function generateStaticParams() {
  const documents = await getRecentlyDocuments();

  return documents.map(({title}) => ({title}));
}

// next.js v15부터 params를 받기 위해 await를 사용해야 함
// https://nextjs.org/docs/messages/sync-dynamic-apis
const DocumentPage = async ({params}: Props) => {
  const {title} = await params;
  const docs = await getDocumentByTitle(title);

  return (
    <div className="flex flex-col gap-6 w-full max-[768px]:gap-2">
      <section className="flex flex-col gap-6 w-full h-fit min-h-[864px] max-[768px]:gap-2 bg-white border-primary-100 border-solid border rounded-xl p-8 max-md:p-4 max-md:gap-2">
        <DocumentHeader title={docs.title} />
        <DocumentContents contents={docs.contents} />
      </section>
      <DocumentFooter generateTime={docs.generateTime} />
    </div>
  );
};

export default DocumentPage;
