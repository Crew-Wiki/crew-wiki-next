import {postDocument} from '@api/document';
import {useInput} from '@components/Input/useInput';
import {ErrorMessage} from '@type/Document.type';
import {validateNicknameOnChange} from '@utils/validation/nickname';
import {validateTitleOnBlur, validateTitleOnChange} from '@utils/validation/title';
import {createContext, useContext, useState} from 'react';

type DocumentWriteContextType = {
  title: string | undefined;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  titleErrorMessage: ErrorMessage;
  onTitleBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => Promise<void>;
  nickname: string | undefined;
  onNicknameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  nicknameErrorMessage: ErrorMessage;
  canSubmit: boolean;
  onSubmit: () => Promise<void>;
  isPending: boolean;
};

const DocumentWriteContext = createContext<DocumentWriteContextType | null>(null);

export const useDocumentWriteContextProvider = () => {
  const context = useContext(DocumentWriteContext);

  if (!context) {
    throw new Error('useDocumentWriteContextProvider는 DocumentWriteContext내부에서 사용되어야 합니다.');
  }

  return context;
};

export const DocumentWriteContextProvider = ({children}: React.PropsWithChildren) => {
  const {
    value: title,
    onChange: onTitleChange,
    errorMessage: titleErrorMessage,
    onBlur: onTitleBlur,
  } = useInput({initialValue: '', validateOnChange: validateTitleOnChange, validateOnBlur: validateTitleOnBlur});

  const {
    value: nickname,
    onChange: onNicknameChange,
    errorMessage: nicknameErrorMessage,
  } = useInput({initialValue: '', validateOnChange: validateNicknameOnChange});

  const canSubmit = titleErrorMessage !== null && nicknameErrorMessage !== null;

  const [isPending, setIsPending] = useState(false);

  const onSubmit = async () => {
    try {
      setIsPending(true);
      // await postDocument()
    } catch (error) {
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DocumentWriteContext.Provider
      value={{
        title,
        onTitleChange,
        titleErrorMessage,
        onTitleBlur,
        nickname,
        onNicknameChange,
        nicknameErrorMessage,
        canSubmit,
        onSubmit,
        isPending,
      }}
    >
      {children}
    </DocumentWriteContext.Provider>
  );
};
