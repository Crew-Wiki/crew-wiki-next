import Button from '@components/common/Button';
import Link from 'next/link';
import DocumentTitle from './DocumentTitle';
import {route} from '@constants/route';

interface DocumentHeaderProps {
  title: string;
  uuid: string;
}

const DocumentHeader = ({title, uuid}: DocumentHeaderProps) => {
  return (
    <header className="flex w-full justify-between max-md:flex-col-reverse max-md:gap-4">
      <DocumentTitle title={title} />
      <nav className="flex gap-2 max-md:hidden">
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
      </nav>
    </header>
  );
};

export default DocumentHeader;
