import {DOCUMENT_TYPE} from '@constants/document';
import {route} from '@constants/route';
import timeConverter from '@utils/TimeConverter';
import Link from 'next/link';
import {api} from '@apis/generated/server';
import {recentlyParams} from '@constants/params';

const RecentlyEdit = async () => {
  const documents = await api.document.get(recentlyParams);

  return (
    <aside className="flex h-fit w-60 flex-col rounded-xl border border-solid border-primary-100 bg-white max-[1024px]:hidden">
      <h2 className="flex h-12 w-full items-center justify-center border-b border-primary-100 font-pretendard text-lg font-bold text-grayscale-800">
        최근 편집
      </h2>
      {documents.data.map(document => {
        const href =
          document.documentType === DOCUMENT_TYPE.Organization
            ? route.goWikiGroup(document.uuid)
            : route.goWiki(document.uuid);
        return (
          <Link
            key={`recently-${document.id}`}
            className="border-b border-grayscale-100 px-2.5 py-2 font-pretendard text-xs font-normal text-grayscale-800 last:border-0"
            href={href}
          >
            {`[${timeConverter(document.generateTime, 'YYYY.MM.DD')}] ${document.title}`}
          </Link>
        );
      })}
    </aside>
  );
};

export default RecentlyEdit;
