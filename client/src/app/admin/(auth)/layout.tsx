import AdminHeader from '@components/layout/Header/AdminHeader';

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex h-screen w-full flex-col">
      <AdminHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
