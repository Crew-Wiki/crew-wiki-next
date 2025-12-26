'use client';

import {useEffect, useState} from 'react';
import PostHeader from '@components/document/Write/PostHeader';
import TitleInputField from '@components/document/Write/TitleInputField';
import OrganizationInputField from '@components/document/Write/OrganizationInputField';
import TuiEditor from '@components/document/TuiEditor';
import {usePostSaveMarkdown} from './usePostSaveMarkdown';
import {useDocument} from '@store/document';
import {Organization} from '@type/Group.type';

const Page = () => {
  const {saveMarkdown, initialValue} = usePostSaveMarkdown();
  const setInit = useDocument(action => action.setInit);
  const reset = useDocument(action => action.reset);
  const onChange = useDocument(action => action.onChange);

  const [selectedOrganizations, setSelectedOrganizations] = useState<Organization[]>([]);

  const handleSelectOrganization = (organization: Organization) => {
    setSelectedOrganizations(prev => [...prev, organization]);
  };

  const handleAddOrganization = (title: string) => {
    const newOrganization: Organization = {
      title,
      uuid: crypto.randomUUID(),
    };

    setSelectedOrganizations(prev => [...prev, newOrganization]);
  };

  const handleRemoveOrganization = (uuid: string) => {
    setSelectedOrganizations(prev => prev.filter(org => org.uuid !== uuid));
  };

  useEffect(() => {
    setInit(
      {
        title: '',
        writer: '',
        contents: initialValue,
      },
      null,
    );

    return () => reset();
  }, [setInit, initialValue, reset]);

  return (
    <section className="flex h-fit w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-[768px]:gap-3 max-[768px]:p-4">
      <PostHeader mode="post" />
      <TitleInputField />
      <OrganizationInputField
        selectedOrganizations={selectedOrganizations}
        onSelect={handleSelectOrganization}
        onAdd={handleAddOrganization}
        onRemove={handleRemoveOrganization}
      />
      <TuiEditor
        initialValue={initialValue}
        saveMarkdown={saveMarkdown}
        onChange={value => onChange(value, 'contents')}
      />
    </section>
  );
};

export default Page;
