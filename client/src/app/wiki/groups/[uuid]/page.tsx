import DocumentHeader from '@components/document/layout/DocumentHeader';
import DocumentFooter from '@components/document/layout/DocumentFooter';
import MobileDocumentHeader from '@components/document/layout/MobileDocumentHeader';
import TimelineSection from './TimelineSection';
import markdownToHtml from '@utils/markdownToHtml';
import {processHtmlContent} from '@utils/processHtmlContent';
import TOC from '@components/document/TOC/TOC';
import '@components/document/layout/toastui-editor-viewer.css';
import {getOrganizationDocumentByUUIDServer} from '@apis/server/organizationDocument';

const GroupPage = async ({params}: {params: Promise<{uuid: string}>}) => {
  const {uuid} = await params;

  const groupDocument = await getOrganizationDocumentByUUIDServer(uuid);

  const html = await markdownToHtml(groupDocument.contents);
  const htmlContents = processHtmlContent(html);

  const extractHeadings = (html: string) => {
    const headings = html.split('\n').filter(str => str.includes('id'));
    headings.push('<h1 id="3">타임라인</h1>');
    return headings;
  };

  return (
    <div className="flex w-full flex-col gap-6 max-[768px]:gap-2">
      <MobileDocumentHeader uuid={groupDocument.organizationDocumentUuid} />
      <section className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:gap-2 max-md:p-4 max-[768px]:gap-2">
        <DocumentHeader title={groupDocument.title} uuid={groupDocument.organizationDocumentUuid} />
        <TOC headTags={extractHeadings(htmlContents)} />
        <div className="toastui-editor-contents" dangerouslySetInnerHTML={{__html: htmlContents}} />

        <TimelineSection events={groupDocument.organizationEventResponses} organizationDocumentUuid={uuid} />
      </section>
      <DocumentFooter generateTime={groupDocument.generateTime} />
    </div>
  );
};

export default GroupPage;
