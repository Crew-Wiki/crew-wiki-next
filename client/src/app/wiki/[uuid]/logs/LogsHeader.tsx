import Button from '@components/common/Button';
import {route} from '@constants/route';
import Link from 'next/link';

type LogsHeaderProps = {
  uuid: string;
};

export const LogsHeader = ({uuid}: LogsHeaderProps) => {
  return (
    <header className="flex w-full justify-between">
      <h1 className="font-bm text-3xl text-grayscale-800">편집로그</h1>
      <fieldset className="flex gap-2">
        <Link href={route.goWiki(uuid)} passHref>
          <Button style="tertiary" size="xs">
            돌아가기
          </Button>
        </Link>
        <Link href={route.goWikiEdit(uuid)} passHref>
          <Button style="primary" size="xs">
            편집하기
          </Button>
        </Link>
      </fieldset>
    </header>
  );
};
