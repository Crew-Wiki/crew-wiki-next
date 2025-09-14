import {create} from 'zustand';
import {ErrorInfo, ErrorMessage} from '@type/Document.type';
import {validateTitleOnBlur, validateTitleOnChange} from '@utils/validation/title';
import {validateWriterOnChange} from '@utils/validation/writer';

export type Field = 'title' | 'writer' | 'contents';

type FieldType = {
  title: string;
  writer: string;
  contents: string;
};

type State = {
  values: FieldType;
  errorMessages: Record<Field, ErrorMessage>;
  uuid: string;
  isImageUploadPending: boolean;
  originalVersion: number;
};

type Validators = {
  validateOnChange?: (value: string) => ErrorInfo;
  validateOnBlur?: (value: string, list?: string[]) => ErrorInfo;
};

type Action = {
  setInit: (initial: FieldType, uuid: string | null, version?: number) => void;
  onChange: (value: string, field: Field) => void;
  onBlur: (value: string, field: Field, list?: string[]) => void;
  reset: () => void;
  updateImageUploadPending: (isPending: boolean) => void;
};

const validators: Map<Field, Validators> = new Map();

validators.set('title', {
  validateOnChange: validateTitleOnChange,
  validateOnBlur: validateTitleOnBlur,
});

validators.set('writer', {
  validateOnChange: validateWriterOnChange,
});

const initialValue: State = {
  values: {
    title: '',
    writer: '',
    contents: '',
  },
  errorMessages: {
    title: null,
    writer: null,
    contents: null,
  },
  uuid: '',
  isImageUploadPending: false,
  originalVersion: 0,
};

export const useDocument = create<State & Action>(set => ({
  ...initialValue,
  setInit: (initial, uuid, version) => {
    set({
      values: {
        title: initial.title,
        writer: initial.writer,
        contents: initial.contents,
      },
      errorMessages: {
        title: null,
        writer: null,
        contents: null,
      },
      uuid: uuid ? uuid : crypto.randomUUID(),
      originalVersion: version ? version : 0,
    });
  },

  onChange: (value, field) => {
    const validate = validators.get(field)?.validateOnChange;

    if (!validate) {
      set(state => ({
        values: {
          ...state.values,
          [field]: value,
        },
      }));
      return;
    }

    const {errorMessage, reset} = validate(value);

    set(state => ({
      errorMessages: {
        ...state.errorMessages,
        [field]: errorMessage,
      },
      values: {
        ...state.values,
        [field]: errorMessage ? (reset?.(value) ?? value) : value,
      },
    }));
  },

  onBlur: (value, field, list) => {
    const validate = validators.get(field)?.validateOnBlur;
    if (!validate) return;

    const {errorMessage} = validate(value, list);

    set(state => ({
      errorMessages: {
        ...state.errorMessages,
        [field]: errorMessage,
      },
    }));
  },

  updateImageUploadPending: (isPending: boolean) => {
    set(() => ({
      isImageUploadPending: isPending,
    }));
  },

  reset: () => {
    set(() => initialValue);
  },
}));
