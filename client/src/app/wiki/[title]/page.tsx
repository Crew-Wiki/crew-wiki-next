import {getDocumentByTitle, getRecentlyDocuments} from '@apis/document';
import DocumentContents from '@components/Document/DocumentContents';
import DocumentFooter from '@components/Document/DocumentFooter';
import DocumentHeader from '@components/Document/DocumentHeader';
import MobileDocumentHeader from '@components/Document/MobileDocumentHeader';
import {CACHE} from '@constants/cache';
import type {TitleParams} from '@type/PageParams.type';
import markdownToHtml from '@utils/markdownToHtml';
import {Metadata} from 'next';

export const revalidate = CACHE.time.revalidate;

export const dynamicParams = true;

export async function generateStaticParams() {
  const documents = await getRecentlyDocuments();

  return documents.map(({title}) => ({title}));
}

export async function generateMetadata({params}: TitleParams): Promise<Metadata> {
  const {title} = await params;
  const documentTitle = decodeURI(title);

  return {
    title: documentTitle,
    description: `${documentTitle}에 대한 정보(논란)를 확인하세요.`,
    openGraph: {
      title: `크루위키 ${documentTitle}의 문서`,
      description: `${documentTitle}에 대한 정보(논란)를 확인하세요.`,
    },
  };
}

// next.js v15부터 params를 받기 위해 await를 사용해야 함
// https://nextjs.org/docs/messages/sync-dynamic-apis
const DocumentPage = async ({params}: TitleParams) => {
  const {title} = await params;
  const document = await getDocumentByTitle(title);
  const contents = await markdownToHtml(document.contents);

  return (
    <div className="flex flex-col gap-6 w-full max-[768px]:gap-2">
      <MobileDocumentHeader title={document.title} />
      <section className="flex flex-col gap-6 w-full h-fit min-h-[864px] max-[768px]:gap-2 bg-white border-primary-100 border-solid border rounded-xl p-8 max-md:p-4 max-md:gap-2">
        <DocumentHeader title={document.title} />
        <DocumentContents contents={contents} />
      </section>
      <DocumentFooter generateTime={document.generateTime} />
    </div>
  );
};

export default DocumentPage;
