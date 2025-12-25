import {TitleAndUUID} from '@apis/client/document';
import {Trie} from '@utils/trie';
import {create} from 'zustand';

type State = {
  trie: Trie;
  titles: TitleAndUUID[];
};

type Action = {
  setInit: (titles: TitleAndUUID[]) => void;
  addTitle: (title: string, uuid: string, documentType: 'CREW' | 'ORGANIZATION') => void;
  updateTitle: (oldTitle: string, newTitle: string, uuid: string, documentType: 'CREW' | 'ORGANIZATION') => void;
  deleteTitle: (title: string, uuid: string) => void;
  searchTitle: (title: string) => TitleAndUUID[];
};

export const useTrie = create<State & Action>((set, get) => ({
  trie: new Trie(),
  titles: [],

  setInit: titles => {
    const trie = new Trie(titles);
    set({trie, titles});
  },

  addTitle: (title, uuid, documentType) => {
    const {trie, titles} = get();
    trie.add(title, uuid, documentType);
    set({titles: [...titles, {title, uuid, documentType}]});
  },

  updateTitle: (oldTitle, newTitle, uuid, documentType) => {
    const {trie, titles} = get();
    trie.update(oldTitle, newTitle, uuid, documentType);
    set({titles: titles.map(t => (t.uuid === uuid ? {title: newTitle, uuid, documentType} : t))});
  },

  deleteTitle: (title, uuid) => {
    const {trie, titles} = get();
    trie.delete(title, uuid);
    set({titles: titles.filter(t => t.uuid !== uuid)});
  },

  searchTitle: title => {
    const {trie} = get();
    const results = trie.search(title);
    return results;
  },
}));
