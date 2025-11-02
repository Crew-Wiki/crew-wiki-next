import {isProduction} from '../utils/nodeEnv';

const DAEMOON = {
  production: '30a6c25d-4b88-11f0-99c4-0a270fc3fae1',
  development: '79febfcd-374f-419e-8138-966c6dbf5624',
};

export const URLS = {
  main: '/',
  wiki: '/wiki',
  docs: ':title',
  edit: '/edit',
  post: '/post',
  daemoon: isProduction ? DAEMOON.production : DAEMOON.development,
  logs: 'logs',
  specificLog: 'log/:logId',
  admin: '/admin',
  login: '/admin/login',
  dashboard: '/admin/dashboard',
  documents: '/admin/documents',
};
