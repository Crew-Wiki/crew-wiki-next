import RandomButton from '@components/common/RandomButton';
import WikiInputField from './WikiInputField';
import Image from 'next/image';
import Link from 'next/link';
import {route} from '@constants/route';
import {usePathname} from 'next/navigation';

type RightHeaderProps = {
  onSubmit: () => void;
  toggleVisibility: () => void;
};

const RightHeader = ({onSubmit, toggleVisibility}: RightHeaderProps) => {
  const pathname = usePathname();

  return (
    <div className="flex items-center">
      <Link
        href={route.goWikiGraph()}
        aria-current={pathname === route.goWikiGraph() ? 'page' : undefined}
        className="mr-2 flex min-h-11 items-center whitespace-nowrap rounded-lg px-2 text-sm text-white hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        관계 그래프
      </Link>
      <RandomButton />
      <WikiInputField className="hidden w-80 md:flex" onSubmit={onSubmit} />
      <Image
        src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/search-circle.svg`}
        width={36}
        height={36}
        alt="search"
        className="cursor-pointer md:hidden"
        onClick={toggleVisibility}
      />
    </div>
  );
};

export default RightHeader;
