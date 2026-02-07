import {getDocumentByUUIDServer} from '@apis/server/document';
import {LogsHeader} from './LogsHeader';
import DocumentFooter from '@components/document/layout/DocumentFooter';
import {UUIDParams} from '@type/PageParams.type';

type Props = React.PropsWithChildren & UUIDParams;

const Layout = async ({children, params}: Props) => {
  const {uuid} = await params;
  const document = await getDocumentByUUIDServer(uuid);

  return (
    document && (
      <section className="flex w-full flex-col items-center gap-6">
        <div className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:gap-2 max-md:p-4">
          <LogsHeader uuid={document.documentUUID} />
          <h1 className="font-bm text-2xl text-grayscale-800">{document.title}</h1>
          {children}
        </div>
        <DocumentFooter generateTime={document.generateTime} />
      </section>
    )
  );
};

export default Layout;
