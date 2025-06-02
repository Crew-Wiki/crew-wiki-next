import {processHtmlContent} from '@utils/processHtmlContent';
import TOC from '../TOC/TOC';

import './toastui-editor-viewer.css';

interface DocumentContentsProps {
  contents: string;
}

const DocumentContents = ({contents}: DocumentContentsProps) => {
  const html = processHtmlContent(contents);

  const extractDataIdsFromHtml = (htmlString: string) => {
    return htmlString.split('\n').filter(str => str.includes('id'));
  };

  return (
    <>
      <TOC headTags={extractDataIdsFromHtml(html)} />
      <section className="toastui-editor-contents" dangerouslySetInnerHTML={{__html: html}} />
    </>
  );
};

export default DocumentContents;
