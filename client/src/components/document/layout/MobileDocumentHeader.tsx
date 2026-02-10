import Button from '@components/common/Button';
import {route} from '@constants/route';
import {DocumentType} from '@type/Document.type';
import Link from 'next/link';

interface MobileDocumentHeaderProps {
  uuid: string;
  documentType?: DocumentType;
}

const MobileDocumentHeader = ({uuid, documentType = DocumentType.Crew}: MobileDocumentHeaderProps) => {
  const editHref = documentType === DocumentType.Organization ? route.goWikiGroupEdit(uuid) : route.goWikiEdit(uuid);
  const logsHref = documentType === DocumentType.Organization ? route.goWikiGroupLogs(uuid) : route.goWikiLogs(uuid);

  return (
    <div className="md:hidden">
      <fieldset className="flex gap-2 max-md:w-full max-md:justify-center">
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
      </fieldset>
    </div>
  );
};

export default MobileDocumentHeader;
