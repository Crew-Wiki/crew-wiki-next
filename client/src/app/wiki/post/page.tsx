'use client';

import {useEffect} from 'react';
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
  const newOrganizations = useDocument(state => state.newOrganizations);
  const existingOrganizations = useDocument(state => state.existingOrganizations);
  const addNewOrganization = useDocument(action => action.addNewOrganization);
  const addExistingOrganization = useDocument(action => action.addExistingOrganization);
  const removeOrganization = useDocument(action => action.removeOrganization);

  const handleSelectOrganization = (organization: Organization) => {
    addExistingOrganization(organization);
  };

  const handleAddOrganization = (title: string) => {
    const newOrganization: Organization = {
      title,
      uuid: crypto.randomUUID(),
    };

    addNewOrganization(newOrganization);
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
        selectedOrganizations={[...newOrganizations, ...existingOrganizations]}
        onSelect={handleSelectOrganization}
        onAdd={handleAddOrganization}
        onRemove={removeOrganization}
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
