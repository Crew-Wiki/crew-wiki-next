import {Route} from 'next';
import {URLS} from './urls';

export const route = {
  goWiki: (uuid: string) => `${URLS.wiki}/${uuid}` as Route,
  goWikiEdit: (uuid: string) => `${URLS.wiki}/${uuid}${URLS.edit}` as Route,
  goWikiLogs: (uuid: string) => `${URLS.wiki}/${uuid}${URLS.logs}` as Route,
  goWikilog: (uuid: string, id: number) => `${URLS.wiki}/${uuid}/log/${id}` as Route,
  goWikiWrite: () => `${URLS.wiki}${URLS.post}` as Route,
  goDaemoon: () => `${URLS.wiki}/${URLS.daemoon}` as Route,

  goAdminLogin: () => URLS.login as Route,
  goAdminDocument: () => URLS.documents as Route,
  goAdminDashboard: () => URLS.dashboard as Route,
};
