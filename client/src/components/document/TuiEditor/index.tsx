'use client';

import '@toast-ui/editor/toastui-editor.css';

import dynamic from 'next/dynamic';

import {UploadImageMeta} from '@type/Document.type';
import {useCallback, useEffect} from 'react';
import RelativeSearchTerms from '@components/common/SearchTerms/RelativeSearchTerms';
import {useRelativeSearchTerms} from './useRelativeSearchTerms';
import useThrottle from '@hooks/useThrottle';
import {useDocumentWriteContext} from '@context/DocumentWriteContext';

const DynamicLoadEditor = dynamic(() => import('@toast-ui/react-editor').then(mod => mod.Editor), {ssr: false});

type HookCallback = (url: string, text?: string) => void;

const toolbar = [
  ['heading', 'bold', 'italic', 'strike'],
  ['hr', 'quote', 'ul', 'ol'],
  ['image', 'link'],
  ['scrollSync'],
];

type TuiEditorProps = {
  saveMarkdown?: (markdown: string) => void;
  initialValue: string;
};

function TuiEditor({initialValue, saveMarkdown}: TuiEditorProps) {
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : false;

  const {editorRef, contentsProps} = useDocumentWriteContext();
  const {setImages, onContentsChange} = contentsProps;

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

  useEffect(() => {
    if (!editorRef.current) return;

    const instance = editorRef.current.getInstance();
    instance.setMarkdown(initialValue);
  }, [editorRef, initialValue]);

  const imageHandler = async (blob: File | Blob, callback: HookCallback) => {
    if (!(blob instanceof File)) {
      const fileFromBlob = new File([blob], 'blob');
      setImageMeta(fileFromBlob, callback);
    } else {
      setImageMeta(blob, callback);
    }
  };

  const {makeThrottle, cleanup} = useThrottle();

  const MARKDOWN_THROTTLE_TIME = 5000;

  const {top, left, titles, onClick, recordRefStartPos, recordRefEndPose, showRelativeSearchTerms} =
    useRelativeSearchTerms({editorRef});

  const handleChange = useCallback(() => {
    if (!editorRef.current) return;

    const instance = editorRef.current.getInstance();
    const markdown = instance.getMarkdown();
    onContentsChange(markdown);

    if (saveMarkdown) {
      const saveMarkDownThrottle = makeThrottle(() => saveMarkdown(markdown), MARKDOWN_THROTTLE_TIME);
      saveMarkDownThrottle();
    }

    recordRefStartPos();
    recordRefEndPose();
  }, [editorRef, makeThrottle, onContentsChange, recordRefEndPose, recordRefStartPos, saveMarkdown]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div onClick={onClick}>
      <DynamicLoadEditor
        ref={editorRef}
        initialValue={initialValue}
        onChange={handleChange}
        initialEditType="markdown"
        autofocus={false}
        previewStyle={isDesktop ? 'vertical' : 'tab'}
        toolbarItems={toolbar}
        hideModeSwitch={true}
        height="500px"
        hooks={{addImageBlobHook: imageHandler}}
      />
      <RelativeSearchTerms
        show={showRelativeSearchTerms}
        style={{top: `${top + 200}px`, left, width: 320}}
        searchTerms={titles ?? []}
      />
    </div>
  );
}

export default TuiEditor;
