import {addDataIdToToc} from './addDataIdToToc';

export const processHtmlContent = (html: string) => {
  return addDataIdToToc(html);
};
