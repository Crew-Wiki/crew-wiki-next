import {TitleParams} from '@type/PageParams.type';
import {Metadata} from 'next';

export async function generateMetadata({params}: TitleParams): Promise<Metadata> {
  const {title} = await params;
  const documentTitle = decodeURI(title);

  return {
    title: `${documentTitle} 편집하기`,
    description: `${documentTitle}의 새로운 정보(논란)를 공유해주세요!`,
  };
}

const Layout = ({children}: React.PropsWithChildren) => {
  return children;
};

export default Layout;
