const Layout = ({children}: React.PropsWithChildren) => {
  return (
    <section className="flex flex-col gap-6 w-full h-fit bg-white border-primary-100 border-solid border rounded-xl p-8 max-[768px]:p-4 max-[768px]:gap-3">
      {children}
    </section>
  );
};

export default Layout;
