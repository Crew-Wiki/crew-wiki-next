import {AmplitudeInitializer} from '@components/common/AmplitudeInitializer';
import WikiHeader from '@components/layout/Header/WikiHeader';
import RecentlyEdit from '@components/layout/RecentlyEdit';
import InitTrie from '@components/layout/Trie/InitTrie';

const Layout = ({children}: React.PropsWithChildren) => {
  return (
    <div className="App relative">
      <AmplitudeInitializer />
      <WikiHeader />
      <InitTrie />
      <div className="flex h-fit items-center justify-center">
        <main className="flex h-fit w-full max-w-[1440px] items-start justify-center gap-6 px-4 py-6 max-[768px]:px-0 max-[768px]:py-2">
          {children}
          <RecentlyEdit />
        </main>
      </div>
    </div>
  );
};

export default Layout;
