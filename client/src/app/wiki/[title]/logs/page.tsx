import {LogContent} from './LogContent';
import {getDocumentLogsByTitle} from '@api/document';

interface Props {
  params: {title: string};
}

const Page = async ({params}: Props) => {
  const {title} = await params;
  const documentLogs = await getDocumentLogsByTitle(title);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex w-full gap-2 px-2 py-3 rounded-2xl bg-primary-50 font-pretendard text-md text-grayscale-800 md:gap-8">
        <div className="w-10 ">
          <p className="w-full text-center font-bold">버전</p>
        </div>
        <div className="grow">
          <p className="w-full text-center font-bold">생성일시</p>
        </div>
        <div className="w-16 ">
          <p className="w-full text-center font-bold">문서 크기</p>
        </div>
        <div className="w-16 ">
          <p className="w-full text-center font-bold">편집자</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {documentLogs?.map(docs => <LogContent key={docs.logId} title={title as string} summary={docs} />)}
      </div>
    </div>
  );
};

export default Page;
