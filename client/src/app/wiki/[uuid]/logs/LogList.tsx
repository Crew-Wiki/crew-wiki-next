'use client';

import type {HistoryResponse} from '@apis/generated/types';
import {DOCUMENT_TYPE, DocumentType} from '@constants/document';
import {InfiniteScrollObserver} from '@components/common/InfinityScrollObserver';
import {LogContent} from './LogContent';
import {useGetDocumentLogs} from '@hooks/fetch/useGetDocumentLogs';

type LogListParams = {
  uuid: string;
  initialData: HistoryResponse[];
  totalPage: number;
  documentType?: DocumentType;
};

export const LogList = ({uuid, initialData, totalPage, documentType = DOCUMENT_TYPE.Crew}: LogListParams) => {
  const {logs, fetchNextPage} = useGetDocumentLogs(uuid, initialData, totalPage);

  return (
    <div className="flex flex-col gap-4">
      {logs?.map(log => (
        <LogContent key={log.id} uuid={uuid} summary={log} documentType={documentType} />
      ))}
      <InfiniteScrollObserver key={uuid} callback={fetchNextPage} />
    </div>
  );
};
