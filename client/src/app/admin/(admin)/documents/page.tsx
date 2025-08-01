'use client';

import Button from '@components/common/Button';
import {useState} from 'react';
import {useInput} from '@components/common/Input/useInput';

interface Document {
  id: number;
  title: string;
  views: number;
  edits: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDocumentsPage() {
  const {value, directlyChangeValue: setValue, onChange} = useInput({});
  const [currentPage, setCurrentPage] = useState(1);

  // 더미 데이터
  const documents: Document[] = Array.from({length: 10}, (_, index) => ({
    id: index + 1,
    title: '루나',
    views: 47,
    edits: 3,
    createdAt: '2025.04.03',
    updatedAt: '2025.05.07',
  }));

  const totalPages = 8;

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
          className="flex-1 rounded-lg border border-grayscale-200 px-4 py-2 font-pretendard text-sm
          text-grayscale-800 placeholder:text-grayscale-lightText focus:border-primary-primary focus:outline-none"
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
            {documents.map(document => (
              <tr key={document.id} className="hover:bg-grayscale-50">
                <td className="px-6 py-4 font-pretendard text-sm text-grayscale-text">{document.title}</td>
                <td className="px-6 py-4 text-center font-pretendard text-sm text-grayscale-text">{document.views}</td>
                <td className="px-6 py-4 text-center font-pretendard text-sm text-grayscale-text">{document.edits}</td>
                <td className="px-6 py-4 text-center font-pretendard text-sm text-grayscale-text">{document.createdAt}</td>
                <td className="px-6 py-4 text-center font-pretendard text-sm text-grayscale-text">{document.updatedAt}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button size="xxs" style="tertiary" onClick={() => console.log('편집', document.id)}>
                      편집
                    </Button>
                    <Button size="xxs" style="text" onClick={() => console.log('문서 삭제', document.id)}>
                      문서 삭제
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className="rounded px-3 py-1 font-pretendard text-sm text-grayscale-500 hover:bg-grayscale-100"
          disabled={currentPage === 1}
        >
          이전
        </button>
        {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
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
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          className="rounded px-3 py-1 font-pretendard text-sm text-grayscale-500 hover:bg-grayscale-100"
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
}
