import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import URLS from '@constants/urls';
import { useNavigate } from 'react-router-dom';
import { WikiDocument } from '@type/DocumentType';
import Button from '../common/Button';

interface MobileDocumentHeaderProps {
  docs: WikiDocument;
}

const MobileDocumentHeader = ({ docs }: MobileDocumentHeaderProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const refreshData = () => {
    queryClient.removeQueries();
    navigate('');
  };

  const goPostPage = () => {
    navigate(URLS.POST);
  };

  const goEditPage = () => {
    navigate(URLS.EDIT, { state: docs });
  };

  const goLogsPage = () => {
    navigate(`${URLS.WIKI}/${docs.title}/${URLS.LOGS}`, { state: docs });
  };

  return (
    <div className="md:hidden">
      <fieldset className="flex gap-2 max-md:w-full max-md:justify-center">
        <Button style="tertiary" size="xs" text="새로고침" onClick={refreshData} />
        <Button style="tertiary" size="xs" text="편집하기" onClick={goEditPage} />
        <Button style="tertiary" size="xs" text="편집로그" onClick={goLogsPage} />
        <Button style="primary" size="xs" text="작성하기" onClick={goPostPage} />
      </fieldset>
    </div>
  );
};

export default MobileDocumentHeader;
