import FloatingButton from '@components/common/FloatingButton';

const Layout = ({children}: React.PropsWithChildren) => {
  return (
    <>
      {children}
      <FloatingButton />
    </>
  );
};

export default Layout;
