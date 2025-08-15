'use client';

import {URLS} from '@constants/urls';
import {twMerge} from 'tailwind-merge';
import {useInput} from '@components/common/Input/useInput';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import RelativeSearchTerms from '@components/common/SearchTerms/RelativeSearchTerms';
import {useTrie} from '@store/trie';

interface WikiInputProps {
  className?: string;
  handleSubmit: () => void;
}

const WikiInputField = ({className, handleSubmit}: WikiInputProps) => {
  const {value, directlyChangeValue: setValue, onChange} = useInput({});
  const router = useRouter();

  const searchTitle = useTrie(state => state.searchTitle);
  const data = searchTitle(value);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (value?.trim() === '') return;

    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const targetUUID = submitter?.id;

    if (targetUUID !== 'search-icon' && targetUUID !== undefined) {
      router.push(`${URLS.wiki}/${targetUUID}`);
    } else if (data.length !== 0) {
      router.push(`${URLS.wiki}/${data[0]?.uuid}`);
    } else {
      router.push(`${URLS.wiki}/${value}`);
    }

    setValue('');
    handleSubmit();
  };

  return (
    <form
      onSubmit={onSubmit}
      className={twMerge(
        'relative flex h-11 gap-2 rounded-xl border border-solid border-grayscale-200 bg-white px-4 py-2.5',
        className,
      )}
    >
      <input
        autoFocus
        className="w-full font-pretendard text-base font-normal text-grayscale-800 outline-none placeholder:text-grayscale-lightText"
        placeholder="검색할 문서의 제목을 입력하세요."
        value={value}
        onChange={onChange}
      />
      <button type="submit" id="search-icon">
        <Image
          className="cursor-pointer max-[768px]:hidden"
          src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/search-circle-secondary.svg`}
          width={24}
          height={24}
          alt="search"
        />
      </button>
      {value.trim() !== '' && <RelativeSearchTerms searchTerms={data} />}
    </form>
  );
};

export default WikiInputField;
