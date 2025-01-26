'use client';

import {Editor, EditorProps} from '@toast-ui/react-editor';
import '@toast-ui/editor/toastui-editor.css';
import {ForwardedRef} from 'react';

type WrappedEditorProps = EditorProps & {
  forwardedRef: ForwardedRef<Editor>;
};

const WrappedEditor = ({forwardedRef, ...restProps}: WrappedEditorProps) => {
  return <Editor ref={forwardedRef} {...restProps} />;
};

export default WrappedEditor;
