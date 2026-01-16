'use client';

import '@toast-ui/editor/toastui-editor.css';

import dynamic from 'next/dynamic';

import {useCallback, useEffect, useRef} from 'react';
import RelativeSearchTerms from '@components/common/SearchTerms/RelativeSearchTerms';
import {useRelativeSearchTerms} from './useRelativeSearchTerms';
import useThrottle from '@hooks/useThrottle';
import {EditorType, HookCallback} from '@type/Editor.type';
import {useDocument} from '@store/document';
import {useUploadImage} from '@hooks/mutation/useUploadImage';

const DynamicLoadEditor = dynamic(() => import('@toast-ui/react-editor').then(mod => mod.Editor), {ssr: false});

const toolbar = [
  ['heading', 'bold', 'italic', 'strike'],
  ['hr', 'quote', 'ul', 'ol'],
  ['image', 'link'],
  ['scrollSync'],
];

type TuiEditorProps = {
  saveMarkdown?: (markdown: string) => void;
  initialValue: string;
  onChange: (value: string) => void;
};

function TuiEditor({initialValue, saveMarkdown, onChange}: TuiEditorProps) {
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
  const editorRef = useRef<EditorType | null>(null);
  const uuid = useDocument(state => state.uuid);

  const {uploadImageAndReplaceUrl} = useUploadImage(uuid);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current) return;
    if (isInitializedRef.current) return;

    const instance = editorRef.current.getInstance();
    instance.setMarkdown(initialValue);
    isInitializedRef.current = true;
  }, [editorRef, initialValue]);

  const imageHandler = async (blob: File | Blob, callback: HookCallback) => {
    if (!(blob instanceof File)) {
      const fileFromBlob = new File([blob], 'blob');
      uploadImageAndReplaceUrl({file: fileFromBlob, callback});
    } else {
      uploadImageAndReplaceUrl({file: blob, callback});
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
    onChange(markdown);

    if (saveMarkdown) {
      const saveMarkDownThrottle = makeThrottle(() => saveMarkdown(markdown), MARKDOWN_THROTTLE_TIME);
      saveMarkDownThrottle();
    }

    recordRefStartPos();
    recordRefEndPose();
  }, [editorRef, makeThrottle, onChange, recordRefEndPose, recordRefStartPos, saveMarkdown]);

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
