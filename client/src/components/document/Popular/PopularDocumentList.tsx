'use client';

import {PopularDocument} from '@type/Document.type';
import PopularDocumentItem from './PopularDocumentItem';

interface PopularDocumentListProps {
  documents: PopularDocument[];
  sortType: 'views' | 'edits';
  startRank?: number;
}

const PopularDocumentList = ({documents, sortType, startRank = 4}: PopularDocumentListProps) => {
  const isDocumentEmpty = documents.length === 0;

  return (
    <>
      {isDocumentEmpty ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
          등록된 문서가 없습니다.
        </div>
      ) : (
        <ol className="flex flex-col gap-2">
          {documents.map((document, index) => (
            <PopularDocumentItem
              key={document.title}
              document={document}
              rank={startRank + index}
              sortType={sortType}
            />
          ))}
        </ol>
      )}
    </>
  );
};

export default PopularDocumentList;
