import {AmplitudeInitializer} from '@components/common/AmplitudeInitializer';
import WikiHeader from '@components/layout/Header/WikiHeader';
import RecentlyEdit from '@components/layout/RecentlyEdit';

const Layout = ({children}: React.PropsWithChildren) => {
  return (
    <div className="App relative">
      <AmplitudeInitializer />
      <WikiHeader />
      <div className="flex items-center justify-center h-fit">
        <main className="flex items-start justify-center h-fit gap-6 py-6 px-4 max-w-[1440px] w-full max-[768px]:py-2 max-[768px]:px-0">
          {children}
          <RecentlyEdit />
        </main>
      </div>
    </div>
  );
};

export default Layout;
