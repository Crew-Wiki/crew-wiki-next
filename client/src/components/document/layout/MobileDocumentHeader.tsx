import Button from '@components/common/Button';
import {route} from '@constants/route';
import Link from 'next/link';

interface MobileDocumentHeaderProps {
  uuid: string;
  documentType?: 'CREW' | 'ORGANIZATION';
}

const MobileDocumentHeader = ({uuid, documentType = 'CREW'}: MobileDocumentHeaderProps) => {
  const editHref = documentType === 'ORGANIZATION' ? route.goWikiGroupEdit(uuid) : route.goWikiEdit(uuid);

  return (
    <div className="md:hidden">
      <fieldset className="flex gap-2 max-md:w-full max-md:justify-center">
        <Link href={editHref}>
          <Button style="tertiary" size="xs">
            편집하기
          </Button>
        </Link>
        {/* TODO: 조직문서에도 편집로그 기능 추가되면 수정 필요 */}
        {documentType === 'CREW' && (
          <Link href={route.goWikiLogs(uuid)}>
            <Button style="tertiary" size="xs">
              편집로그
            </Button>
          </Link>
        )}
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
