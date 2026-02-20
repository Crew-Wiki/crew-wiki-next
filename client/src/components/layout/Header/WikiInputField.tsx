'use client';

import {twMerge} from 'tailwind-merge';
import {useState} from 'react';
import {useInput} from '@components/common/Input/useInput';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import RelativeSearchTerms from '@components/common/SearchTerms/RelativeSearchTerms';
import {useTrie} from '@store/trie';
import useAmplitude from '@hooks/useAmplitude';
import {route} from '@constants/route';
import {DOCUMENT_TYPE} from '@type/Document.type';

interface WikiInputProps {
  className?: string;
  onSubmit: () => void;
}

const WikiInputField = ({className, onSubmit}: WikiInputProps) => {
  const {value, directlyChangeValue: setValue, onChange} = useInput({});
  const [showDropdown, setShowDropdown] = useState(true);
  const router = useRouter();
  const {trackDocumentSearch} = useAmplitude();

  const searchTitle = useTrie(action => action.searchTitle);
  const data = searchTitle(value);

  const getRouteByDocumentType = (uuid: string, documentType?: string) => {
    return documentType === DOCUMENT_TYPE.Organization ? route.goWikiGroup(uuid) : route.goWiki(uuid);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (value?.trim() === '') return;

    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const targetUUID = submitter?.id;
    const targetDocumentType = submitter?.dataset?.documentType;

    if (targetUUID !== 'search-icon' && targetUUID !== undefined) {
      trackDocumentSearch(value, targetUUID);
      router.push(getRouteByDocumentType(targetUUID, targetDocumentType));
    } else if (data.length !== 0) {
      trackDocumentSearch(value, data[0].uuid ?? 'not_found');
      router.push(getRouteByDocumentType(data[0].uuid, data[0].documentType));
    } else {
      trackDocumentSearch(value, 'not_found');
      router.push(route.goWiki(value));
    }

    setValue('');
    onSubmit();
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setShowDropdown(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setShowDropdown(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
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
        onChange={handleChange}
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
      {showDropdown && value.trim() !== '' && <RelativeSearchTerms searchTerms={data} />}
    </form>
  );
};

export default WikiInputField;
