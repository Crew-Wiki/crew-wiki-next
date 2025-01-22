import {getSpecificDocumentLog} from '@api/document';
import DocumentContents from '@components/Document/DocumentContents';
import DocumentFooter from '@components/Document/DocumentFooter';
import DocumentHeader from '@components/Document/DocumentHeader';

interface Props {
  params: {title: string; logId: string};
}

const Page = async ({params}: Props) => {
  const {title, logId} = await params;
  const document = await getSpecificDocumentLog(Number(logId));

  return (
    <section className="flex flex-col items-center w-full gap-6">
      <div className="flex flex-col gap-6 w-full h-fit bg-white border-primary-100 border-solid border rounded-xl p-8 max-[768px]:p-4 max-[768px]:gap-2 ">
        <DocumentHeader title={decodeURI(title)} />
        <DocumentContents contents={document.contents} />
      </div>
      <DocumentFooter generateTime={document.generateTime} />
    </section>
  );
};

export default Page;
