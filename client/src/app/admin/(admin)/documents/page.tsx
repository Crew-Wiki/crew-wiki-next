'use client';

import Button from '@components/common/Button';
import {useState, useEffect, useMemo} from 'react';
import {useInput} from '@components/common/Input/useInput';
import {getAllDocumentsServer, deleteDocumentServer} from '@apis/server/document';
import {WikiDocumentExpand} from '@type/Document.type';
import {useRouter} from 'next/navigation';
import {URLS} from '@constants/urls';

export default function AdminDocumentsPage() {
  const {value, onChange} = useInput({});
  const [currentPage, setCurrentPage] = useState(1);
  const [documents, setDocuments] = useState<WikiDocumentExpand[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<WikiDocumentExpand[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const pageSize = 10;

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const allDocs = await getAllDocumentsServer();
        setDocuments(allDocs);
        setFilteredDocuments(allDocs);
      } catch (error) {
        console.error('문서를 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    const filtered = documents.filter(document => document.title.toLowerCase().includes(value.toLowerCase()));
    setFilteredDocuments(filtered);
    setCurrentPage(1);
  }, [value, documents]);

  const totalPages = Math.ceil(filteredDocuments.length / pageSize);

  const paginatedDocuments = filteredDocuments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pageNumbers = useMemo(() => {
    const currentGroup = Math.floor((currentPage - 1) / 10);
    const startPage = currentGroup * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);

    return Array.from({length: endPage - startPage + 1}, (_, index) => startPage + index);
  }, [currentPage, totalPages]);

  const getDeleteConfirmMessage = (title: string) => {
    return `"${title}" 문서를 정말 삭제하시겠어요?\n이 작업은 되돌릴 수 없어요.`;
  };

  const handleDelete = async (uuid: string, title: string) => {
    const confirmMessage = getDeleteConfirmMessage(title);

    if (confirm(confirmMessage)) {
      try {
        await deleteDocumentServer(uuid);
        const updatedDocs = documents.filter(document => document.uuid !== uuid);
        setDocuments(updatedDocs);
        setFilteredDocuments(
          updatedDocs.filter(document => document.title.toLowerCase().includes(value.toLowerCase())),
        );
        alert('문서가 삭제되었습니다.');
      } catch (error) {
        console.error('문서 삭제 실패:', error);
        alert('문서 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-grayscale-lightText">문서를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-bm text-2xl text-grayscale-text">문서 관리</h1>

      {/* 검색 */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="검색할 문서의 제목을 입력하세요."
          value={value}
          onChange={onChange}
          className="flex-1 rounded-lg border border-grayscale-200 px-4 py-2 font-pretendard text-sm text-grayscale-800 placeholder:text-grayscale-lightText focus:border-primary-primary focus:outline-none"
        />
      </div>

      {/* 테이블 */}
      <div className="overflow-hidden rounded-lg border border-grayscale-200">
        <table className="w-full">
          <thead className="bg-grayscale-50">
            <tr>
              <th className="px-6 py-3 text-left font-pretendard text-sm font-medium text-grayscale-700">문서 제목</th>
              <th className="px-6 py-3 text-center font-pretendard text-sm font-medium text-grayscale-700">조회수</th>
              <th className="px-6 py-3 text-center font-pretendard text-sm font-medium text-grayscale-700">수정수</th>
              <th className="px-6 py-3 text-center font-pretendard text-sm font-medium text-grayscale-700">생성일</th>
              <th className="px-6 py-3 text-center font-pretendard text-sm font-medium text-grayscale-700">
                최근 편집일
              </th>
              <th className="px-6 py-3 text-center font-pretendard text-sm font-medium text-grayscale-700">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grayscale-100">
            {paginatedDocuments.map(document => {
              const createdDate = new Date(document.generateTime)
                .toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\. /g, '.')
                .replace(/\.$/, '');

              return (
                <tr key={document.uuid} className="hover:bg-grayscale-50">
                  <td
                    className="px-6 py-4 font-pretendard text-sm text-grayscale-text hover:cursor-pointer hover:text-primary-primary hover:underline"
                    onClick={() => router.push(`${URLS.wiki}/${document.uuid}`)}
                  >
                    {document.title}
                  </td>
                  <td className="px-6 py-4 text-center font-pretendard text-sm text-grayscale-text">-</td>
                  <td className="px-6 py-4 text-center font-pretendard text-sm text-grayscale-text">-</td>
                  <td className="px-6 py-4 text-center font-pretendard text-sm text-grayscale-text">{createdDate}</td>
                  <td className="px-6 py-4 text-center font-pretendard text-sm text-grayscale-text">{createdDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="xxs"
                        style="tertiary"
                        onClick={() => router.push(`${URLS.wiki}/${document.uuid}${URLS.edit}`)}
                      >
                        편집
                      </Button>
                      <Button size="xxs" style="text" onClick={() => handleDelete(document.uuid, document.title)}>
                        문서 삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => {
            const currentGroup = Math.floor((currentPage - 1) / 10);
            if (currentGroup > 0) {
              setCurrentPage(currentGroup * 10);
            }
          }}
          className="rounded px-3 py-1 font-pretendard text-sm text-grayscale-500 hover:bg-grayscale-100"
          disabled={currentPage <= 10}
        >
          이전
        </button>
        {pageNumbers.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`rounded px-3 py-1 font-pretendard text-sm ${
              currentPage === page ? 'bg-primary-primary text-white' : 'text-grayscale-500 hover:bg-grayscale-100'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => {
            const currentGroup = Math.floor((currentPage - 1) / 10);
            const nextGroupFirstPage = (currentGroup + 1) * 10 + 1;
            if (nextGroupFirstPage <= totalPages) {
              setCurrentPage(nextGroupFirstPage);
            }
          }}
          className="rounded px-3 py-1 font-pretendard text-sm text-grayscale-500 hover:bg-grayscale-100"
          disabled={Math.floor((currentPage - 1) / 10) >= Math.floor((totalPages - 1) / 10)}
        >
          다음
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          className="rounded px-3 py-1 font-pretendard text-sm text-grayscale-500 hover:bg-grayscale-100"
          disabled={currentPage === totalPages}
        >
          끝
        </button>
      </div>
    </div>
  );
}
