import Button from '@components/common/Button';
import Link from 'next/link';
import DocumentTitle from './DocumentTitle';
import {route} from '@constants/route';
import {DOCUMENT_TYPE, DocumentType} from '@type/Document.type';

interface DocumentHeaderProps {
  title: string;
  uuid: string;
  documentType?: DocumentType;
}

const DocumentHeader = ({title, uuid, documentType = DOCUMENT_TYPE.Crew}: DocumentHeaderProps) => {
  const editHref = documentType === DOCUMENT_TYPE.Organization ? route.goWikiGroupEdit(uuid) : route.goWikiEdit(uuid);
  const logsHref = documentType === DOCUMENT_TYPE.Organization ? route.goWikiGroupLogs(uuid) : route.goWikiLogs(uuid);

  return (
    <header className="flex w-full justify-between max-md:flex-col-reverse max-md:gap-4">
      <DocumentTitle title={title} />
      <nav className="flex gap-2 max-md:hidden">
        <Link href={editHref}>
          <Button style="tertiary" size="xs">
            편집하기
          </Button>
        </Link>
        <Link href={logsHref}>
          <Button style="tertiary" size="xs">
            편집기록
          </Button>
        </Link>
        <Link href={route.goWikiWrite()}>
          <Button style="primary" size="xs">
            작성하기
          </Button>
        </Link>
      </nav>
    </header>
  );
};

export default DocumentHeader;
