import {getSpecificDocumentLog} from '@api/document';
import DocumentContents from '@components/Document/DocumentContents';
import DocumentFooter from '@components/Document/DocumentFooter';
import DocumentHeader from '@components/Document/DocumentHeader';
import MobileDocumentHeader from '@components/Document/MobileDocumentHeader';
import type {LogParams} from '@type/PageParams.type';
import markdownToHtml from '@utils/markdownToHtml';
import {Metadata} from 'next';

export async function generateMetadata({params}: LogParams): Promise<Metadata> {
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

const Page = async ({params}: LogParams) => {
  const {title, logId} = await params;
  const document = await getSpecificDocumentLog(Number(logId));
  const contents = await markdownToHtml(document.contents);

  return (
    <section className="flex flex-col items-center w-full gap-6">
      <MobileDocumentHeader title={document.title} />
      <div className="flex flex-col gap-6 w-full h-fit bg-white border-primary-100 border-solid border rounded-xl p-8 max-[768px]:p-4 max-[768px]:gap-2 ">
        <DocumentHeader title={decodeURI(title)} />
        <DocumentContents contents={contents} />
      </div>
      <DocumentFooter generateTime={document.generateTime} />
    </section>
  );
};

export default Page;
