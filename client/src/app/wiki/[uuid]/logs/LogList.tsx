'use client';

import {InfiniteScrollObserver} from '@components/common/InfinityScrollObserver';
import {LogContent} from './LogContent';
import {WikiDocumentLogSummary} from '@type/Document.type';
import {useGetDocumentLogs} from '@hooks/fetch/useGetDocumentLogs';

type LogListParams = {
  uuid: string;
  initialData: WikiDocumentLogSummary[];
  totalPage: number;
};

export const LogList = ({uuid, initialData, totalPage}: LogListParams) => {
  const {logs, fetchNextPage} = useGetDocumentLogs(uuid, initialData, totalPage);

  return (
    <div className="flex flex-col gap-4">
      {logs?.map(log => (
        <LogContent key={log.id} uuid={uuid} summary={log} />
      ))}
      <InfiniteScrollObserver key={uuid} callback={fetchNextPage} />
    </div>
  );
};
