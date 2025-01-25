import type {TitleParams} from '@type/PageParams.type';
import {LogContent} from './LogContent';
import {getDocumentLogsByTitle} from '@api/document';
import {Metadata} from 'next';

export async function generateMetadata({params}: TitleParams): Promise<Metadata> {
  const {title} = await params;
  const documentTitle = decodeURI(title);

  return {
    title: `${documentTitle} 편집로그`,
    description: `${documentTitle} 문서의 편집로그입니다.`,
    openGraph: {
      title: `크루위키 ${documentTitle}문서의 편집로그`,
      description: `${documentTitle}에 대한 정보(논란)를 확인하세요.`,
    },
  };
}

const Page = async ({params}: TitleParams) => {
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
