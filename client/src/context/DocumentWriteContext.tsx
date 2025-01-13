'use client';

import {postDocument, PostDocumentContent} from '@api/document';
import {useInput} from '@components/Input/useInput';
import {ErrorMessage, UploadImageMeta} from '@type/Document.type';
import {EditorRef, EditorType} from '@type/Editor.type';
import {getBytes} from '@utils/getBytes';
import {validateWriterOnChange} from '@utils/validation/writer';
import {validateTitleOnBlur, validateTitleOnChange} from '@utils/validation/title';
import {createContext, useContext, useRef, useState} from 'react';
import {uploadImages} from '@api/images';
import {useRouter} from 'next/navigation';
import {URLS} from '@constants/urls';

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
    value: writer,
    onChange: onWriterChange,
    errorMessage: writerErrorMessage,
  } = useInput({initialValue: '', validateOnChange: validateWriterOnChange});

  const editorRef = useRef<EditorType | null>(null);
  const [images, setImages] = useState<UploadImageMeta[]>([]);

  const getContents = (): string => {
    if (editorRef.current) {
      const instance = editorRef.current?.getInstance();
      const contents = instance.getMarkdown();
      return contents;
    }
    return '';
  };

  const isError = titleErrorMessage !== null || writerErrorMessage !== null;
  const isEmpty = title.trim() === '' || writer.trim() === '';

  const canSubmit = !isError && !isEmpty;
  const [isPending, setIsPending] = useState(false);

  const replaceLocalUrlToS3Url = (contents: string, imageMetaList: UploadImageMeta[]) => {
    let newContents = contents;
    imageMetaList.forEach(({objectURL, s3URL}) => {
      newContents = newContents.replace(objectURL, s3URL);
    });

    return newContents;
  };

  const router = useRouter();

  const onSubmit = async () => {
    try {
      setIsPending(true);

      const newMetaList = await uploadImages(title, images);
      const linkReplacedContents = replaceLocalUrlToS3Url(getContents() ?? '', newMetaList);

      const document: PostDocumentContent = {
        title,
        contents: linkReplacedContents,
        writer,
        documentBytes: getBytes(linkReplacedContents),
      };

      const newDocument = await postDocument(document);
      router.push(`${URLS.wiki}/${newDocument.title}`);
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
        writer,
        onWriterChange,
        writerErrorMessage,
        canSubmit,
        onSubmit,
        isPending,
        setImages,
        editorRef,
      }}
    >
      {children}
    </DocumentWriteContext.Provider>
  );
};
