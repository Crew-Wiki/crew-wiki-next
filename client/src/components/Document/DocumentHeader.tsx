import {URLS} from '@constants/urls';
import DocumentTitle from './DocumentTitle';
import Button from '@components/Button';
import Link from 'next/link';

interface DocumentHeaderProps {
  title: string;
}

const DocumentHeader = ({title}: DocumentHeaderProps) => {
  return (
    <header className="max-md:flex-col-reverse max-md:gap-4 flex justify-between w-full">
      <DocumentTitle title={title} />
      <nav className="flex gap-2 max-md:hidden">
        <Link href={`${URLS.wiki}/${URLS.edit}`}>
          <Button style="tertiary" size="xs">
            편집하기
          </Button>
        </Link>
        <Link href={`${URLS.wiki}/${title}/${URLS.logs}`}>
          <Button style="tertiary" size="xs">
            편집로그
          </Button>
        </Link>
        <Link href={`${URLS.wiki}/${URLS.post}`}>
          <Button style="primary" size="xs">
            작성하기
          </Button>
        </Link>
      </nav>
    </header>
  );
};

export default DocumentHeader;
