import {ErrorInfo} from '@type/Document.type';

export const validateWriterOnChange = (writer: string) => {
  const errorInfo: ErrorInfo = {
    errorMessage: null,
    reset: null,
  };

  const onlyKorean = /^[ㄱ-ㅎ가-힣]*$/.test(writer);

  if (writer.length <= 3 && !onlyKorean) {
    errorInfo.errorMessage = '닉네임은 한글만 입력할 수 있어요';
    errorInfo.reset = (writer: string) => writer.replace(/[^ㄱ-ㅎ가-힣]/g, '');
  } else if (writer.length > 4) {
    errorInfo.errorMessage = '닉네임은 4자가 최대에요';
    errorInfo.reset = (writer: string) => writer.slice(0, 4);
  } else {
    errorInfo.errorMessage = null;
    errorInfo.reset = null;
  }

  return errorInfo;
};
