import type {UUIDLogParams, UUIDParams} from '@type/PageParams.type';
import {LogContent} from './LogContent';
import {Metadata} from 'next';
import {getDocumentLogsByUUIDServer} from '@apis/server/document';
import {getDocumentTitleUsingUUID} from '@utils/getDocumentUsingUUIDInCache';

export async function generateMetadata({params}: UUIDLogParams): Promise<Metadata> {
  const {uuid} = await params;
  const documentTitle = await getDocumentTitleUsingUUID(uuid);

  return {
    title: `${documentTitle} 편집로그`,
    description: `${documentTitle} 문서의 편집로그입니다.`,
    openGraph: {
      title: `크루위키 ${documentTitle}문서의 편집로그`,
      description: `${documentTitle}에 대한 정보(논란)를 확인하세요.`,
    },
  };
}

const Page = async ({params}: UUIDParams) => {
  const {uuid} = await params;
  const documentLogs = await getDocumentLogsByUUIDServer(uuid);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-md flex w-full gap-2 rounded-2xl bg-primary-50 px-2 py-3 font-pretendard text-grayscale-800 md:gap-8">
        <div className="w-10">
          <p className="w-full text-center font-bold">버전</p>
        </div>
        <div className="grow">
          <p className="w-full text-center font-bold">생성일시</p>
        </div>
        <div className="w-16">
          <p className="w-full text-center font-bold">문서 크기</p>
        </div>
        <div className="w-16">
          <p className="w-full text-center font-bold">편집자</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {documentLogs?.map(docs => <LogContent key={docs.logId} uuid={uuid as string} summary={docs} />)}
      </div>
    </div>
  );
};

export default Page;
