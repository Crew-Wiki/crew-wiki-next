'use client';

import OrganizationInputField from '@components/document/Write/OrganizationInputField';
import OrganizationSection from '@components/document/layout/OrganizationSection';

const mockOrganizations = [
  {title: '크루위키부흥위원회', uuid: 'test-uuid-1'},
  {title: '조직', uuid: 'test-uuid-2'},
  {title: '테스트 그룹', uuid: 'test-uuid-3'},
];

const Page = () => {
  return (
    <section className="flex w-full flex-col items-center gap-6">
      <div className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:gap-2 max-md:p-4">
        <h1 className="font-bm text-2xl text-grayscale-800">테스트</h1>
        <OrganizationSection organizations={mockOrganizations} />
        <OrganizationInputField
          selectedOrganizations={[{uuid: '1', title: '크루위키부흥위원회'}]}
          onSelect={org => console.log('선택', org)}
          onAdd={org => console.log('추가', org)}
          onRemove={uuid => console.log('제거', uuid)}
        />
      </div>
    </section>
  );
};

export default Page;
