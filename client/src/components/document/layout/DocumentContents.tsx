import {processHtmlContent} from '@utils/processHtmlContent';
import TOC from '../TOC/TOC';

import './toastui-editor-viewer.css';
import {AttachTocClickHandler} from '@components/document/TOC/AttachTocClickHandler';

interface DocumentContentsProps {
  contents: string;
}

const DocumentContents = ({contents}: DocumentContentsProps) => {
  const html = processHtmlContent(contents);

  const extractDataIdsFromHtml = (htmlString: string) => {
    return htmlString.split('\n').filter(str => str.includes('data-id'));
  };

  return (
    <>
      <TOC headTags={extractDataIdsFromHtml(html)} />
      <AttachTocClickHandler />
      <section className="toastui-editor-contents" dangerouslySetInnerHTML={{__html: html}} />
    </>
  );
};

export default DocumentContents;
