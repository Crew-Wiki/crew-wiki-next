'use client';

import {useState} from 'react';
import {useInput} from '@components/common/Input/useInput';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import {Chip} from '@components/common/Chip';
import RelativeSearchTerms from '@components/common/SearchTerms/RelativeSearchTerms';
import {useTrie} from '@store/trie';
import {TitleAndUUID} from '@apis/client/document';
import {Organization} from '@type/Group.type';

interface OrganizationInputFieldProps {
  selectedOrganizations: Organization[];
  onSelect: (organization: Organization) => void;
  onAdd: (title: string) => void;
  onRemove: (uuid: string) => void;
}

const OrganizationInputField = ({selectedOrganizations, onSelect, onRemove, onAdd}: OrganizationInputFieldProps) => {
  const {value, onChange, directlyChangeValue: setValue} = useInput({});
  const [showDropdown, setShowDropdown] = useState(false);

  const searchTitle = useTrie(state => state.searchTitle);

  const searchResults = searchTitle(value).filter(
    (doc): doc is TitleAndUUID & {documentType: 'ORGANIZATION'} =>
      doc.documentType === 'ORGANIZATION' && !selectedOrganizations.some(selected => selected.uuid === doc.uuid),
  );

  const handleSelectOrganization = (event: React.MouseEvent<HTMLButtonElement>) => {
    const uuid = event.currentTarget.id;
    const title = event.currentTarget.dataset.title;

    if (uuid && title) {
      onSelect({title, uuid});
      setValue('');
      setShowDropdown(false);
    }
  };

  const handleAddNewOrganization = () => {
    if (value.trim() === '') return;

    const existingOrganization = searchTitle(value).find(
      doc => doc.documentType === 'ORGANIZATION' && doc.title === value,
    );

    if (existingOrganization) {
      onSelect({title: existingOrganization.title, uuid: existingOrganization.uuid});
    } else {
      onAdd(value);
    }

    setValue('');
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div className="flex flex-col gap-4">
      {selectedOrganizations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOrganizations.map(organization => (
            <Chip key={organization.uuid} text={organization.title} onClick={() => onRemove(organization.uuid)} />
          ))}
        </div>
      )}

      <div className="relative flex gap-2">
        <div className="relative">
          <Input
            input={value}
            handleChangeInput={onChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="소속을 추가해 주세요"
            className="h-11 w-[280px] gap-2 rounded-xl border border-solid border-grayscale-200 bg-white px-4 py-2.5 focus:border-grayscale-200 active:border-grayscale-200"
          />
          {showDropdown && value.trim() !== '' && searchResults.length > 0 && (
            <RelativeSearchTerms searchTerms={searchResults} onClick={handleSelectOrganization} />
          )}
        </div>
        <Button style="primary" size="s" type="button" disabled={!value.trim()} onClick={handleAddNewOrganization}>
          추가하기
        </Button>
      </div>
    </div>
  );
};

export default OrganizationInputField;
