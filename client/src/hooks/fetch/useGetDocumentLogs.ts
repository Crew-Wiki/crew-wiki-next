import type {HistoryResponse} from '@apis/generated/types';
import {useEffect, useState} from 'react';
import {api} from '@apis/generated/client';

export const useGetDocumentLogs = (uuid: string, initialData: HistoryResponse[], totalPage: number) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<HistoryResponse[]>(initialData);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.document.uuid(uuid).log.get({
        pageNumber: page,
        pageSize: 10,
        sort: 'ID',
        sortDirection: 'DESC',
      });

      setData(prev => [...prev, ...response.data]);
    };

    if (page > 0) {
      fetchData();
    }
  }, [page, uuid]);

  const fetchNextPage = () => {
    if (page >= totalPage) return;
    setPage(prev => prev + 1);
  };

  return {
    logs: data,
    fetchNextPage,
  };
};
