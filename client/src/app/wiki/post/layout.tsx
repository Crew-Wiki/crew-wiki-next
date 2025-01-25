import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: '작성하기',
  description: '크루들의 정보(논란)를 공유해주세요!',
};

const Layout = ({children}: React.PropsWithChildren) => {
  return children;
};

export default Layout;
