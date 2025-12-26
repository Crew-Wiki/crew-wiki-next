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
    <div className="flex flex-col gap-2">
      {/* TODO: CSS 검토 필요 */}
      <h1 className="font-bm text-2xl text-grayscale-800">소속</h1>
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
