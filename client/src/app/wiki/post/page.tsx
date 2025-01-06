'use client';

import PostHeader from '@components/Write/PostHeader';
import TitleInputField from '@components/Write/TitleInputField';
import PostContents from '@components/Write/PostContents';
import {DocumentWriteContextProvider} from '../../../context/DocumentWriteContext';

const PostPage = () => {
  return (
    <>
      <PostHeader />
      <TitleInputField />
      {/* <PostContents /> */}
    </>
  );
};

const Page = () => {
  return (
    <DocumentWriteContextProvider>
      <PostPage />
    </DocumentWriteContextProvider>
  );
};

export default Page;
