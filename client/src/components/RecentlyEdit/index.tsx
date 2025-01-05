import {URLS} from '@constants/urls';
import timeConverter from '@utils/TimeConverter';
import Link from 'next/link';
import {RecentlyDocument} from '@type/Document.type';
import {http} from '@utils/http';
import {ENDPOINT} from '@constants/endpoint';
import {CACHE} from '@constants/cache';

interface RecentlyDocumentsResponse {
  documents: RecentlyDocument[];
}

const RecentlyEdit = async () => {
  const {documents} = await http.get<RecentlyDocumentsResponse>({
    endpoint: ENDPOINT.getRecentlyDocuments,
    next: {revalidate: CACHE.time.revalidate, tags: [CACHE.tag.getRecentlyDocuments]},
  });

  return (
    <aside className="max-[1024px]:hidden flex flex-col w-60 h-fit bg-white border-primary-100 border-solid border rounded-xl">
      <h2 className="flex justify-center items-center w-full h-12 font-pretendard font-bold text-lg border-b border-primary-100 text-grayscale-800">
        최근 편집
      </h2>
      {documents.slice(0, 20).map(document => {
        return (
          <Link
            key={`recently-${document.documentId}`}
            className="px-2.5 py-2 font-pretendard font-normal text-xs border-b border-grayscale-100 last:border-0 text-grayscale-800"
            href={`${URLS.wiki}/${document.title}`}
          >
            {`[${timeConverter(document.generateTime, 'YYYY.MM.DD')}] ${document.title}`}
          </Link>
        );
      })}
    </aside>
  );
};

export default RecentlyEdit;
