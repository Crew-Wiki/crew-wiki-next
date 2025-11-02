import Button from '@components/common/Button';
import {route} from '@constants/route';
import Link from 'next/link';

interface MobileDocumentHeaderProps {
  uuid: string;
}

const MobileDocumentHeader = ({uuid}: MobileDocumentHeaderProps) => {
  return (
    <div className="md:hidden">
      <fieldset className="flex gap-2 max-md:w-full max-md:justify-center">
        <Link href={route.goWikiEdit(uuid)}>
          <Button style="tertiary" size="xs">
            편집하기
          </Button>
        </Link>
        <Link href={route.goWikiLogs(uuid)}>
          <Button style="tertiary" size="xs">
            편집로그
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
