'use client';

import {useRef, useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import TOC from './TOC';

const Viewer = dynamic(() => import('@toast-ui/react-editor').then(mod => mod.Viewer), {ssr: false});
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

type ToastUiViewer = {
  getInstance(): ToastUiEditorViewer;
};

type ToastUiEditorViewer = {
  options: {el: HTMLElement};
  setMarkdown: (markdown: string) => void;
};

interface DocumentContentsProps {
  contents: string;
}

const DocumentContents = ({contents}: DocumentContentsProps) => {
  const viewerRef = useRef<ToastUiViewer>(null);
  const [headTags, setHeadTags] = useState<Element[]>([]);

  const getHeadTags = (viewerInstance: ToastUiEditorViewer) => {
    const viewerText = viewerInstance.options.el;
    const headingTag = viewerText.querySelectorAll('h1, h2, h3');

    headingTag.forEach((head, index) => {
      if (head instanceof HTMLElement) {
        head.dataset.index = `${index}`;
      }
    });

    setHeadTags(Array.from(headingTag));
  };

  useEffect(() => {
    const instance = viewerRef.current?.getInstance();
    instance?.setMarkdown(contents);
    if (instance) {
      getHeadTags(instance);
    }
  }, [contents]);

  return (
    <>
      <TOC headTags={headTags} />
      <Viewer
        ref={viewerRef}
        initialValue={contents}
        onLoad={() => viewerRef.current && getHeadTags(viewerRef.current.getInstance())}
      />
    </>
  );
};

export default DocumentContents;
