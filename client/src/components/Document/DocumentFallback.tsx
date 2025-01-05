import React from 'react';
import { AxiosError } from 'axios';

import { FallbackProps } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';
import URLS from '@constants/urls';
import DocumentTitle from '../common/DocumentTitle';
import Button from '../common/Button';

interface Error {
  errorMessage: string;
}

const DocumentFallback = ({ error }: FallbackProps) => {
  const axiosError = error as AxiosError;
  const errorDetail = axiosError.response?.data as Error;

  const navigate = useNavigate();
  const { title } = useParams();

  const goPostPage = () => {
    navigate(URLS.POST);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-fit min-h-[864px] bg-white border-primary-100 border-solid border rounded-xl p-8 max-md:p-4">
      <header className="max-[768px]:gap-4 flex justify-between w-full">
        <DocumentTitle title={title ?? ''} />
        <fieldset className="flex gap-2">
          <Button style="primary" size="xs" text="작성하기" onClick={goPostPage} />
        </fieldset>
      </header>
      <h1 className="font-bm text-2xl text-grayscale-800">{'존재하지 않는 문서에요.'}</h1>
    </div>
  );
};

export default DocumentFallback;
