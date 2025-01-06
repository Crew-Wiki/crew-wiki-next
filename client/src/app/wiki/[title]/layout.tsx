import FloatingButton from '@components/FloatingButton';

const Layout = ({children}: React.PropsWithChildren) => {
  return (
    <>
      {children}
      <FloatingButton />
    </>
  );
};

export default Layout;
