import {EditorRef} from '@type/Editor.type';

export const getEditorContents = (editorRef: EditorRef): string => {
  if (editorRef.current) {
    const instance = editorRef.current?.getInstance();
    const contents = instance.getMarkdown();
    return contents;
  }
  return '';
};
