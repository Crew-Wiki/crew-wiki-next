import {addDataIdToToc} from './addDataIdToToc';
import {processImageHtml} from './processImageHtml';

export const processHtmlContent = (html: string) => {
  let processed = addDataIdToToc(html);
  processed = processImageHtml(processed);
  return processed;
};
