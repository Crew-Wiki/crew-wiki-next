import {route} from '@constants/route';
import {WikiDocumentLogSummary} from '@type/Document.type';
import timeConverter from '@utils/TimeConverter';
import Link from 'next/link';

type LogContentProps = {
  uuid: string;
  summary: WikiDocumentLogSummary;
};

export const LogContent = ({uuid, summary}: LogContentProps) => {
  const {id, version, generateTime, documentBytes, writer} = summary;

  return (
    <Link
      href={route.goWikilog(uuid, id)}
      passHref
      className="text-md flex w-full items-center justify-center gap-2 rounded-2xl border border-primary-100 px-2 py-4 font-pretendard text-grayscale-800 md:gap-8"
    >
      <div className="w-10">
        <p className="w-full text-center">{version}</p>
      </div>
      <div className="flex grow justify-center text-center">
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
