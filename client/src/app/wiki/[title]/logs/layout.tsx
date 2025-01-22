import {LogsHeader} from './LogsHeader';
import DocumentFooter from '@components/Document/DocumentFooter';
import {getDocumentByTitle} from '@api/document';

type Props = React.PropsWithChildren & {
  params: {title: string};
};

const Layout = async ({children, params}: Props) => {
  const {title} = await params;
  const document = await getDocumentByTitle(title);

  return (
    document && (
      <section className="flex flex-col items-center w-full gap-6">
        <div className="flex flex-col gap-6 w-full h-fit min-h-[864px] bg-white border-primary-100 border-solid border rounded-xl p-8 max-md:p-4 max-md:gap-2">
          <LogsHeader title={document.title} />
          <h1 className="font-bm text-2xl text-grayscale-800">{document.title}</h1>
          {children}
        </div>
        <DocumentFooter generateTime={document.generateTime} />
      </section>
    )
  );
};

export default Layout;
