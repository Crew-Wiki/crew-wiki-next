import {processHtmlContent} from '@utils/processHtmlContent';
import {Organization} from '@type/Group.type';
import TOC from '../TOC/TOC';
import OrganizationSection from './OrganizationSection';

import './toastui-editor-viewer.css';

interface DocumentContentsProps {
  contents: string;
  organizations?: Organization[];
}

const DocumentContents = ({contents, organizations = []}: DocumentContentsProps) => {
  const html = processHtmlContent(contents);

  const extractDataIdsFromHtml = (htmlString: string) => {
    return htmlString.split('\n').filter(str => str.includes('id'));
  };

  return (
    <>
      <TOC headTags={extractDataIdsFromHtml(html)} />
      <OrganizationSection organizations={organizations} />
      <section className="toastui-editor-contents" dangerouslySetInnerHTML={{__html: html}} />
    </>
  );
};

export default DocumentContents;
