import React from 'react';
import { useParams } from 'react-router-dom';
import useGetDocumentByTitle from '@api/get/useGetDocumentByTitle';
import DocumentHeader from './DocumentHeader';
import DocumentContents from './DocumentContents';
import DocumentFooter from './DocumentFooter';
import MobileDocumentHeader from './MobileDocumentHeader';

interface DocumentPageProps {
  daemoon?: string;
}

const DocumentPage = ({ daemoon }: DocumentPageProps) => {
  const { title } = useParams();
  const { docs } = useGetDocumentByTitle(title ?? daemoon ?? '');

  return (
    <>
      <MobileDocumentHeader docs={docs} />
      <div className="flex flex-col gap-6 w-full h-fit min-h-[864px] bg-white border-primary-100 border-solid border rounded-xl p-8 max-md:p-4 max-md:gap-2">
        <DocumentHeader wiki={docs} />
        <DocumentContents contents={docs.contents} />
      </div>
      <DocumentFooter generateTime={docs.generateTime} />
    </>
  );
};

export default DocumentPage;
