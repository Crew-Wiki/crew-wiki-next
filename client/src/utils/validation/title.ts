'use client';

import {ErrorInfo} from '@type/Document.type';

export const validateTitleOnChange = (title: string) => {
  const errorInfo: ErrorInfo = {
    errorMessage: null,
    reset: null,
  };

  if (title.length > 12) {
    errorInfo.errorMessage = '제목은 12자가 최대에요';
    errorInfo.reset = (title: string) => title.slice(0, 12);
  } else {
    errorInfo.errorMessage = null;
    errorInfo.reset = null;
  }

  return errorInfo;
};

export const validateTitleOnBlur = (title: string, titleList?: string[]) => {
  const errorInfo: ErrorInfo = {
    errorMessage: null,
    reset: null,
  };

  const trimmedTitle = title.trim();

  if (titleList?.some(title => title.trim() === trimmedTitle)) {
    errorInfo.errorMessage = '이미 있는 문서입니다.';
  } else {
    errorInfo.errorMessage = null;
  }

  return errorInfo;
};
