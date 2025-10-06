import {getDocumentByUUIDServer} from '@apis/server/document';
import {UUIDParams} from '@type/PageParams.type';
import {Metadata} from 'next';

export async function generateMetadata({params}: UUIDParams): Promise<Metadata> {
  const {uuid} = await params;
  const document = await getDocumentByUUIDServer(uuid);

  return {
    title: `${document?.title} 편집하기`,
    description: `${document?.title}의 새로운 정보(논란)를 공유해주세요!`,
  };
}

const Layout = ({children}: React.PropsWithChildren) => {
  return children;
};

export default Layout;
