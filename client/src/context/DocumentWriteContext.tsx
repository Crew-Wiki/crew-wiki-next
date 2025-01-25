'use client';

import {type PostDocumentContent} from '@apis/document';
import {useInput} from '@components/Input/useInput';
import {ErrorMessage, UploadImageMeta} from '@type/Document.type';
import {EditorRef, EditorType} from '@type/Editor.type';
import {getBytes} from '@utils/getBytes';
import {validateWriterOnChange} from '@utils/validation/writer';
import {validateTitleOnBlur, validateTitleOnChange} from '@utils/validation/title';
import {createContext, useContext, useRef, useState} from 'react';
import {uploadImages} from '@apis/images';

import {usePostDocument} from '@hooks/mutation/usePostDocument';
import {usePutDocument} from '@hooks/mutation/usePutDocument';
import {replaceLocalUrlToS3Url} from '@utils/replaceLocalUrlToS3Url';
import {getEditorContents} from '@utils/getEditorContents';

type DocumentWriteContextType = {
  title: string | undefined;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  titleErrorMessage: ErrorMessage;
  onTitleBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => Promise<void>;
  writer: string | undefined;
  onWriterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  writerErrorMessage: ErrorMessage;
  canSubmit: boolean;
  onSubmit: () => Promise<void>;
  isPending: boolean;
  setImages: React.Dispatch<React.SetStateAction<UploadImageMeta[]>>;
  editorRef: EditorRef;
  initialContents?: string;
};

const DocumentWriteContext = createContext<DocumentWriteContextType | null>(null);

export const useDocumentWriteContext = () => {
  const context = useContext(DocumentWriteContext);

  if (!context) {
    throw new Error('useDocumentWriteContext는 DocumentWriteContext내부에서 사용되어야 합니다.');
  }

  return context;
};

type EditInitialData = {
  mode: 'post' | 'edit';
  title?: string;
  writer?: string;
  contents?: string;
};

type DocumentWriteContextProps = React.PropsWithChildren<EditInitialData>;

export const DocumentWriteContextProvider = ({children, mode, ...initialData}: DocumentWriteContextProps) => {
  const {
    value: title,
    onChange: onTitleChange,
    errorMessage: titleErrorMessage,
    onBlur: onTitleBlur,
  } = useInput({
    initialValue: initialData.title,
    validateOnChange: validateTitleOnChange,
    validateOnBlur: validateTitleOnBlur,
  });

  const {
    value: writer,
    onChange: onWriterChange,
    errorMessage: writerErrorMessage,
  } = useInput({initialValue: initialData.writer, validateOnChange: validateWriterOnChange});

  const editorRef = useRef<EditorType | null>(null);
  const [images, setImages] = useState<UploadImageMeta[]>([]);

  const initialContents = initialData.contents;

  const isError = titleErrorMessage !== null || writerErrorMessage !== null;
  const isEmpty = title.trim() === '' || writer.trim() === '';
  const canSubmit = !isError && !isEmpty;

  const {postDocument, isPostPending} = usePostDocument();
  const {putDocument, isPutPending} = usePutDocument();

  const onSubmit = async () => {
    const newMetaList = await uploadImages({albumName: title, uploadImageMetaList: images});
    const linkReplacedContents = replaceLocalUrlToS3Url(getEditorContents(editorRef), newMetaList);

    const document: PostDocumentContent = {
      title,
      contents: linkReplacedContents,
      writer,
      documentBytes: getBytes(linkReplacedContents),
    };

    if (mode === 'post') {
      postDocument(document);
    } else {
      putDocument(document);
    }
  };

  return (
    <DocumentWriteContext.Provider
      value={{
        title,
        onTitleChange,
        titleErrorMessage,
        onTitleBlur,
        writer,
        onWriterChange,
        writerErrorMessage,
        canSubmit,
        onSubmit,
        isPending: isPostPending || isPutPending,
        setImages,
        editorRef,
        initialContents,
      }}
    >
      {children}
    </DocumentWriteContext.Provider>
  );
};
