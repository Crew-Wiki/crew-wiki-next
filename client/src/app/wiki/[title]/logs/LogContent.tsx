import {URLS} from '@constants/urls';
import {WikiDocumentLogSummary} from '@type/Document.type';
import timeConverter from '@utils/TimeConverter';
import Link from 'next/link';

type LogContentProps = {
  title: string;
  summary: WikiDocumentLogSummary;
};

export const LogContent = ({title, summary}: LogContentProps) => {
  const {logId, version, generateTime, documentBytes, writer} = summary;

  return (
    <Link
      href={`${URLS.wiki}/${title}/log/${logId}`}
      passHref
      className="flex items-center justify-center w-full gap-2 px-2 py-4 border border-primary-100 rounded-2xl font-pretendard text-md  text-grayscale-800 md:gap-8"
    >
      <div className="w-10">
        <p className="w-full text-center">{version}</p>
      </div>
      <div className="grow text-center flex justify-center">
        <p className="w-[144px] text-center md:w-full">
          {timeConverter(generateTime, 'YYYY년 M월 D일 (ddd) HH:mm:ss')}
        </p>
      </div>
      <div className="w-16">
        <p className="w-full text-center">{`${documentBytes ?? 0}B`}</p>
      </div>
      <div className="w-16">
        <p className="w-full text-center">{writer}</p>
      </div>
    </Link>
  );
};
