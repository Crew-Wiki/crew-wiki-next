'use client';

import SearchCircle from '@app/image/search-circle-secondary.svg';
import {URLS} from '@constants/urls';
import {twMerge} from 'tailwind-merge';
import {useInput} from '@components/Input/useInput';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import useSearchDocumentByQuery from '@hooks/fetch/useSearchDocumentByQuery';
import RelativeSearchTerms from '@components/SearchTerms/RelativeSearchTerms';

interface WikiInputProps {
  className?: string;
  handleSubmit: (e: React.FormEvent) => void;
}

const WikiInputField = ({className, handleSubmit}: WikiInputProps) => {
  const {value, directlyChangeValue: setValue, onChange} = useInput({});
  const router = useRouter();

  const {titles} = useSearchDocumentByQuery(value);

  const onSubmit = (event: React.FormEvent, search?: string) => {
    event.preventDefault();
    if (value?.trim() === '') return;

    if (search !== undefined) {
      router.push(`${URLS.wiki}/${search}`);
    } else if (titles !== undefined && titles.length !== 0) {
      router.push(`${URLS.wiki}/${titles[0]}`);
    } else {
      router.push(`${URLS.wiki}/${value}`);
    }

    setValue('');
    handleSubmit(event);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={twMerge(
        'flex relative h-11 px-4 py-2.5 rounded-xl bg-white border-grayscale-200 border-solid border gap-2',
        className,
      )}
    >
      <input
        autoFocus
        className="w-full outline-none font-pretendard text-base font-normal text-grayscale-800 placeholder:text-grayscale-lightText "
        placeholder="검색할 문서의 제목을 입력하세요."
        value={value}
        onChange={onChange}
      />
      <button>
        <Image className="cursor-pointer max-[768px]:hidden" src={SearchCircle} alt="search" />
      </button>
      {value.trim() !== '' && (
        <RelativeSearchTerms
          showRelativeSearchTerms={titles.length > 0}
          searchTerms={titles ?? []}
          onClick={onSubmit}
        />
      )}
    </form>
  );
};

export default WikiInputField;
