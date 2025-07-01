import {getRecentlyDocumentsServer} from '@apis/server/document';
import {URLS} from '@constants/urls';
import timeConverter from '@utils/TimeConverter';
import Link from 'next/link';

const RecentlyEdit = async () => {
  const documents = await getRecentlyDocumentsServer();

  return (
    <aside className="flex h-fit w-60 flex-col rounded-xl border border-solid border-primary-100 bg-white max-[1024px]:hidden">
      <h2 className="flex h-12 w-full items-center justify-center border-b border-primary-100 font-pretendard text-lg font-bold text-grayscale-800">
        최근 편집
      </h2>
      {documents.map(document => {
        return (
          <Link
            key={`recently-${document.id}`}
            className="border-b border-grayscale-100 px-2.5 py-2 font-pretendard text-xs font-normal text-grayscale-800 last:border-0"
            href={`${URLS.wiki}/${document.uuid}`}
          >
            {`[${timeConverter(document.generateTime, 'YYYY.MM.DD')}] ${document.title}`}
          </Link>
        );
      })}
    </aside>
  );
};

export default RecentlyEdit;
