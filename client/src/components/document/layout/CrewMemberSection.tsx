'use client';

import {useRouter} from 'next/navigation';
import {LinkedCrewDocumentResponse} from '@type/Group.type';
import {Chip} from '@components/common/Chip';
import {route} from '@constants/route';

interface CrewMemberSectionProps {
  crewDocuments: LinkedCrewDocumentResponse[];
}

const CrewMemberSection = ({crewDocuments}: CrewMemberSectionProps) => {
  const router = useRouter();

  if (crewDocuments.length === 0) {
    return null;
  }

  return (
    <div className="-mt-4">
      <div className="flex flex-wrap gap-2">
        {crewDocuments.map(crew => (
          <Chip
            key={crew.documentUuid}
            text={crew.title}
            variant="link"
            onClick={() => router.push(route.goWiki(crew.documentUuid))}
          />
        ))}
      </div>
    </div>
  );
};

export default CrewMemberSection;
