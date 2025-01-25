'use client';

import Button from '@components/Button';
import DocumentTitle from '@components/Document/DocumentTitle';
import {URLS} from '@constants/urls';
import {useParams, useRouter} from 'next/navigation';

const Error = () => {
  const {title} = useParams();
  const router = useRouter();

  const goPostPage = () => {
    router.push(`${URLS.wiki}${URLS.post}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-fit min-h-[864px] bg-white border-primary-100 border-solid border rounded-xl p-8 max-md:p-4">
      <header className="max-[768px]:gap-4 flex justify-between w-full">
        <DocumentTitle title={decodeURI(title as string)} />
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

export default Error;
