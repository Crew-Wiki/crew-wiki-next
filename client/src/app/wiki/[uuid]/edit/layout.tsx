import {api} from '@apis/generated/server';
import {UUIDParams} from '@type/PageParams.type';
import {Metadata} from 'next';

export async function generateMetadata({params}: UUIDParams): Promise<Metadata> {
  const {uuid} = await params;
  const document = await api.document.uuid(uuid).get();

  return {
    title: document ? `${document.title} 편집하기` : '편집하기',
    description: document
      ? `${document?.title}의 새로운 정보(논란)를 공유해주세요!`
      : '새로운 정보(논란)를 공유해주세요!',
  };
}

const Layout = ({children}: React.PropsWithChildren) => {
  return children;
};

export default Layout;
