'use client';

import {useRouter} from 'next/navigation';
import {Organization} from '@type/Group.type';
import {Chip} from '@components/common/Chip';
import {route} from '@constants/route';

interface OrganizationSectionProps {
  organizations: Organization[];
}

const OrganizationSection = ({organizations}: OrganizationSectionProps) => {
  const router = useRouter();

  if (organizations.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold leading-7 text-[#222]">소속</h1>
      <div className="flex flex-wrap gap-2">
        {organizations.map(organization => (
          <Chip
            key={organization.uuid}
            text={organization.title}
            variant="link"
            onClick={() => router.push(route.goWikiGroup(organization.uuid))}
          />
        ))}
      </div>
    </div>
  );
};

export default OrganizationSection;
