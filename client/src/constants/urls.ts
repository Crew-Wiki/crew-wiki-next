export const URLS = {
  main: '/',
  wiki: '/wiki',
  docs: ':title',
  edit: '/edit',
  post: '/post',
  daemoon:
    process.env.NODE_ENV === 'production'
      ? '30a6c25d-4b88-11f0-99c4-0a270fc3fae1'
      : '79febfcd-374f-419e-8138-966c6dbf5624',
  logs: 'logs',
  specificLog: 'log/:logId',
};
