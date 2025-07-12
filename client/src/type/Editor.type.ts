import {type Editor} from '@toast-ui/react-editor';

export type EditorType = Editor;
export type EditorRef = React.RefObject<Editor | null>;
export type NotNullableEditorRef = React.RefObject<Editor>;
export type HookCallback = (url: string, text?: string) => void;
