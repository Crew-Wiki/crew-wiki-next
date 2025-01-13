'use client';

import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('@toast-ui/react-editor').then(mod => mod.Editor), {ssr: false});

import {type Editor as EditorType, EditorProps} from '@toast-ui/react-editor';
import '@toast-ui/editor/toastui-editor.css';
import {useEffect, useState} from 'react';
import {UploadImageMeta} from '@type/Document.type';
import {useDocumentWriteContextProvider} from '../../context/DocumentWriteContext';

type HookCallback = (url: string, text?: string) => void;

interface Props extends EditorProps {
  initialValue: string | null;
}

const toolbar = [
  ['heading', 'bold', 'italic', 'strike'],
  ['hr', 'quote', 'ul', 'ol'],
  ['image', 'link'],
  ['scrollSync'],
];

function TuiEditor({initialValue, ...editorProps}: Props) {
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : false;

  const {editorRef, setImages} = useDocumentWriteContextProvider();

  const setImageMeta = (file: File, callback: HookCallback) => {
    const objectURL = URL.createObjectURL(file);
    callback(objectURL, '미리보기');
    const imageMeta: UploadImageMeta = {
      file,
      objectURL,
      s3URL: '',
    };
    setImages(prev => [...prev, imageMeta]);
  };

  const imageHandler = async (blob: File | Blob, callback: HookCallback) => {
    if (!(blob instanceof File)) {
      const fileFromBlob = new File([blob], 'blob');
      setImageMeta(fileFromBlob, callback);
    } else {
      setImageMeta(blob, callback);
    }
  };

  const setEditorInstance = (instance: EditorType) => {
    if (editorRef?.current) editorRef.current = instance;
  };

  return (
    <Editor
      initialValue={initialValue ?? '내용을 입력해주세요.'}
      initialEditType="markdown"
      autofocus={false}
      previewStyle={isDesktop ? 'vertical' : 'tab'}
      ref={editorRef}
      toolbarItems={toolbar}
      hideModeSwitch={true}
      height="500px"
      hooks={{addImageBlobHook: imageHandler}}
      onLoad={setEditorInstance}
      {...editorProps}
    />
  );
}

export default TuiEditor;
