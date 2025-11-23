'use client';

import Button from '@components/common/Button';
import DocumentTitle from '@components/document/layout/DocumentTitle';
import {route} from '@constants/route';
import {useParams, useRouter} from 'next/navigation';

const NotFound = () => {
  const {uuid} = useParams();
  const router = useRouter();

  const goPostPage = () => {
    router.push(route.goWikiWrite());
  };

  return (
    <div className="flex h-fit min-h-[864px] w-full flex-col gap-6 rounded-xl border border-solid border-primary-100 bg-white p-8 max-md:p-4">
      <header className="flex w-full justify-between max-[768px]:gap-4">
        <DocumentTitle title={uuid as string} />
        <fieldset className="flex gap-2">
          <Button style="primary" size="xs" onClick={goPostPage}>
            작성하기
          </Button>
        </fieldset>
      </header>
      <h1 className="font-bm text-2xl text-grayscale-800">존재하지 않는 문서에요.</h1>
    </div>
  );
};

export default NotFound;
