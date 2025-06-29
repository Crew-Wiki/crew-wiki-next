import {create} from 'zustand';
import {ErrorInfo, ErrorMessage, UploadImageMeta} from '@type/Document.type';
import {validateTitleOnBlur, validateTitleOnChange} from '@utils/validation/title';
import {validateWriterOnChange} from '@utils/validation/writer';

export type Field = 'title' | 'writer' | 'contents' | 'images';
export type ExcludeImages = Exclude<Field, 'images'>;

type FieldType = {
  title: string;
  writer: string;
  contents: string;
  images: UploadImageMeta[];
};

type State = {
  values: FieldType;
  errorMessages: Record<Field, ErrorMessage>;
};

type Validators = {
  validateOnChange?: (value: string) => ErrorInfo;
  validateOnBlur?: (value: string, list?: string[]) => ErrorInfo;
};

type Action = {
  setInit: (initial: FieldType) => void;
  addImage: (newImage: UploadImageMeta) => void;
  onChange: (value: string, field: ExcludeImages) => void;
  onBlur: (value: string, field: ExcludeImages, list?: string[]) => void;
  reset: () => void;
};

const validators: Map<Field, Validators> = new Map();

validators.set('title', {
  validateOnChange: validateTitleOnChange,
  validateOnBlur: validateTitleOnBlur,
});

validators.set('writer', {
  validateOnChange: validateWriterOnChange,
});

const initialValue = {
  values: {
    title: '',
    writer: '',
    contents: '',
    images: [],
  },
  errorMessages: {
    title: null,
    writer: null,
    contents: null,
    images: null,
  },
};

export const useDocument = create<State & Action>((set, get) => ({
  ...initialValue,
  setInit: initial => {
    set({
      values: initial,
      errorMessages: {
        title: null,
        writer: null,
        contents: null,
        images: null,
      },
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

  addImage: newImage => {
    set(state => ({
      values: {
        ...state.values,
        images: [...state.values.images, newImage],
      },
    }));
  },

  reset: () => {
    set(() => initialValue);
  },
}));
