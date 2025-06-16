'use client';

import {type PostDocumentContent} from '@apis/document';
import {useInput} from '@components/common/Input/useInput';
import {ErrorMessage, UploadImageMeta} from '@type/Document.type';
import {EditorRef, EditorType} from '@type/Editor.type';
import {getBytes} from '@utils/getBytes';
import {validateWriterOnChange} from '@utils/validation/writer';
import {validateTitleOnBlur, validateTitleOnChange} from '@utils/validation/title';
import {createContext, useCallback, useContext, useRef, useState} from 'react';
import {uploadImages} from '@apis/images';

import {usePostDocument} from '@hooks/mutation/usePostDocument';
import {usePutDocument} from '@hooks/mutation/usePutDocument';
import {replaceLocalUrlToS3Url} from '@utils/replaceLocalUrlToS3Url';
import {EDITOR} from '@constants/editor';
import {useParams} from 'next/navigation';

export type TitleProps = {
  title: string;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleBlur: (event: React.FocusEvent<HTMLInputElement, Element>, list?: string[]) => void;
  titleErrorMessage: ErrorMessage;
};

export type WriterProps = {
  writer: string;
  onWriterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  writerErrorMessage: ErrorMessage;
};

export type ContentsProps = {
  contents: string;
  initialContents: string;
  onContentsChange: (value: string) => void;
  setImages: React.Dispatch<React.SetStateAction<UploadImageMeta[]>>;
};

type DocumentWriteContextType = {
  titleProps: TitleProps;
  writerProps: WriterProps;
  contentsProps: ContentsProps;
  canSubmit: boolean;
  onPostSubmit: () => Promise<void>;
  onEditSubmit: () => Promise<void>;
  isPending: boolean;
  editorRef: EditorRef;
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
  title?: string;
  writer?: string;
  contents?: string;
};

type DocumentWriteContextProps = React.PropsWithChildren<EditInitialData>;

export const DocumentWriteContextProvider = ({children, ...initialData}: DocumentWriteContextProps) => {
  const params = useParams();

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

  const initialContents = initialData.contents ?? EDITOR.initialValue;
  const [contents, setContents] = useState(initialContents);

  const onContentsChange = useCallback((value: string) => {
    setContents(value);
  }, []);

  const isError = titleErrorMessage !== null || writerErrorMessage !== null;
  const isEmpty = title.trim() === '' || writer.trim() === '' || contents.trim() === '';
  const canSubmit = !isError && !isEmpty;

  const {postDocument, isPostPending} = usePostDocument();
  const {putDocument, isPutPending} = usePutDocument();

  const onPostSubmit = async () => {
    const uuid = crypto.randomUUID();
    const newMetaList = await uploadImages({documentUUID: uuid, uploadImageMetaList: images});
    const linkReplacedContents = replaceLocalUrlToS3Url(contents, newMetaList);

    const document: PostDocumentContent = {
      title,
      contents: linkReplacedContents,
      writer,
      documentBytes: getBytes(linkReplacedContents),
      uuid,
    };

    postDocument(document);
  };

  const onEditSubmit = async () => {
    const uuid = params.uuid as string;
    const newMetaList = await uploadImages({documentUUID: uuid, uploadImageMetaList: images});
    const linkReplacedContents = replaceLocalUrlToS3Url(contents, newMetaList);

    const document: PostDocumentContent = {
      title,
      contents: linkReplacedContents,
      writer,
      documentBytes: getBytes(linkReplacedContents),
      uuid,
    };

    putDocument(document);
  };

  return (
    <DocumentWriteContext.Provider
      value={{
        titleProps: {
          title,
          onTitleBlur,
          onTitleChange,
          titleErrorMessage,
        },
        writerProps: {
          writer,
          onWriterChange,
          writerErrorMessage,
        },
        contentsProps: {
          contents,
          initialContents,
          onContentsChange,
          setImages,
        },
        canSubmit,
        onPostSubmit,
        onEditSubmit,
        isPending: isPostPending || isPutPending,
        editorRef,
      }}
    >
      {children}
    </DocumentWriteContext.Provider>
  );
};
