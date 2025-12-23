import AdminHeader from '@components/layout/Header/AdminHeader';
import Sidebar from '@components/admin/Sidebar';

const Layout = ({children}: React.PropsWithChildren) => {
  return (
    <div className="flex h-screen w-full flex-col text-white">
             <AdminHeader />




      <div className="flex flex-1 overflow-hidden">
        <Sidebar
        />
        <main className="flex-1 overflow-y-auto bg-white p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
