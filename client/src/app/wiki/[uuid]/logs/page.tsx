import type {UUIDLogParams, UUIDParams} from '@type/PageParams.type';
import {Metadata} from 'next';
import {getDocumentLogsByUUIDServer} from '@apis/server/document';
import {LogList} from './LogList';
import {generateLogsPageMetadata} from '@utils/generateDocumentMetadata';

export async function generateMetadata({params}: UUIDLogParams): Promise<Metadata> {
  const {uuid} = await params;
  return await generateLogsPageMetadata(uuid);
}

const Page = async ({params}: UUIDParams) => {
  const {uuid} = await params;
  const response = await getDocumentLogsByUUIDServer(uuid);

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
      <LogList key={uuid} uuid={uuid} initialData={response.data} totalPage={response.totalPage} />
    </div>
  );
};

export default Page;
