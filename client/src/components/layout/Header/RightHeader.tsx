import RandomButton from '@components/common/RandomButton';
import WikiInputField from './WikiInputField';
import Image from 'next/image';

type RightHeaderProps = {
  onSubmit: () => void;
  toggleVisibility: () => void;
};

const RightHeader = ({onSubmit, toggleVisibility}: RightHeaderProps) => {
  return (
    <div className="flex items-center">
      <RandomButton />
      <WikiInputField className="w-80 hidden md:flex" handleSubmit={onSubmit} />
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
