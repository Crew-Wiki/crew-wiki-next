import {ErrorInfo} from '@type/Document.type';

export const validateNicknameOnChange = (nickname: string) => {
  const errorInfo: ErrorInfo = {
    errorMessage: null,
    reset: null,
  };

  const onlyKorean = /^[ㄱ-ㅎ가-힣]*$/.test(nickname);

  if (nickname.length <= 3 && !onlyKorean) {
    errorInfo.errorMessage = '닉네임은 한글만 입력할 수 있어요';
    errorInfo.reset = (nickname: string) => nickname.replace(/[^ㄱ-ㅎ가-힣]/g, '');
  } else if (nickname.length > 4) {
    errorInfo.errorMessage = '닉네임은 4자가 최대에요';
    errorInfo.reset = (nickname: string) => nickname.slice(0, 4);
  } else {
    errorInfo.errorMessage = null;
    errorInfo.reset = null;
  }

  return errorInfo;
};
