const SPLITTER = '/';

export const mySessionStorage = {
  get(keys: string[]) {
    return window.sessionStorage.getItem(keys.join(SPLITTER));
  },
  set(keys: string[], item: string) {
    window.sessionStorage.setItem(keys.join(SPLITTER), item);
  },

  getJSON(keys: string[]) {
    return JSON.parse(this.get(keys) ?? '{}');
  },
  setJSON(keys: string[], item: object) {
    this.set(keys, JSON.stringify(item));
  },

  has(keys: string[]) {
    return this.get(keys) !== null;
  },

  remove(keys: string[]) {
    window.sessionStorage.removeItem(keys.join(SPLITTER));
  },
};
