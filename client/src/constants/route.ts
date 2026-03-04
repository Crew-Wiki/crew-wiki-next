import {Route} from 'next';
import {URLS} from './urls';

export const route = {
  goWiki: (uuid: string) => `${URLS.wiki}/${uuid}` as Route,
  goWikiGroup: (uuid: string) => `${URLS.wikiGroups}/${uuid}` as Route,
  goWikiEdit: (uuid: string) => `${URLS.wiki}/${uuid}${URLS.edit}` as Route,
  goWikiGroupEdit: (uuid: string) => `${URLS.wikiGroups}/${uuid}${URLS.edit}` as Route,
  goWikiLogs: (uuid: string) => `${URLS.wiki}/${uuid}${URLS.logs}` as Route,
  goWikiGroupLogs: (uuid: string) => `${URLS.wikiGroups}/${uuid}${URLS.logs}` as Route,
  goWikiLog: (uuid: string, id: number) => `${URLS.wiki}/${uuid}/log/${id}` as Route,
  goWikiGroupLog: (uuid: string, id: number) => `${URLS.wikiGroups}/${uuid}/log/${id}` as Route,
  goWikiWrite: () => `${URLS.wiki}${URLS.post}` as Route,
  goDaemoon: () => `${URLS.wiki}/${URLS.daemoon}` as Route,

  goAdminLogin: () => URLS.login as Route,
  goAdminDocument: () => URLS.documents as Route,
  goAdminDashboard: () => URLS.dashboard as Route,
};
