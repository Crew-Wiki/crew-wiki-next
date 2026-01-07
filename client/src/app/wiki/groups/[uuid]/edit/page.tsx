'use client';

import {useParams, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import Button from '@components/common/Button';
import DocumentTitle from '@components/document/layout/DocumentTitle';
import TuiEditor from '@components/document/TuiEditor';
import Input from '@components/common/Input';
import {getOrganizationDocumentByUUIDClient} from '@apis/client/organization';
import {usePutOrganizationDocument} from '@hooks/mutation/usePutOrganizationDocument';
import {OrganizationDocumentWithEventsResponse} from '@type/Group.type';
import {getBytes} from '@utils/getBytes';

const OrganizationEditPage = () => {
  const {uuid} = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<OrganizationDocumentWithEventsResponse | null>(null);
  const [contents, setContents] = useState('');
  const [writer, setWriter] = useState('');
  const {putOrganizationDocument, isPutPending} = usePutOrganizationDocument();

  useEffect(() => {
    const fetchDocument = async () => {
      const doc = await getOrganizationDocumentByUUIDClient(uuid as string);
      setDocument(doc);
      setContents(doc.contents);
      setWriter(doc.writer);
    };

    fetchDocument();
  }, [uuid]);

  const handleSubmit = () => {
    if (!document) return;

    putOrganizationDocument({
      title: document.title,
      contents,
      writer,
      documentBytes: getBytes(contents),
      uuid: document.organizationDocumentUuid,
    });
  };

  const goBack = () => {
    router.back();
  };

  const canSubmit = writer.trim() !== '';

  if (!document) {
    return null;
  }

  return (
    <section className="flex h-fit w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-[768px]:gap-3 max-[768px]:p-4">
      <header className="flex w-full justify-between">
        <DocumentTitle title="조직 문서 편집" />
        <fieldset className="flex gap-2">
          <Button type="button" style="tertiary" size="xs" onClick={goBack}>
            취소하기
          </Button>
          <Button style="primary" size="xs" disabled={!canSubmit || isPutPending} onClick={handleSubmit}>
            작성완료
          </Button>
        </fieldset>
      </header>
      <div className="flex h-fit w-full gap-6">
        <Input
          className="flex h-14 w-full gap-2 rounded-xl border border-solid border-grayscale-200 px-4 py-2.5 font-bm text-2xl max-[768px]:h-10 max-[768px]:text-sm"
          input={document.title}
          handleChangeInput={() => {}}
          disabled
        />
        <Input
          className="flex h-14 w-36 gap-2 rounded-xl border border-solid border-grayscale-200 bg-white px-4 py-2.5 font-bm text-2xl max-[768px]:h-10 max-[768px]:text-sm"
          placeholder="편집자"
          input={writer}
          handleChangeInput={event => setWriter(event.target.value)}
        />
      </div>
      <TuiEditor initialValue={document.contents} onChange={setContents} />
    </section>
  );
};

export default OrganizationEditPage;
