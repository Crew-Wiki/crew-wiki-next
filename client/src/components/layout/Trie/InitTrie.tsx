'use client';

import {useGetDocumentTitleList} from '@hooks/fetch/useGetDocumentTitleList';
import {useTrie} from '@store/trie';
import {useEffect} from 'react';

const InitTrie = () => {
  const {data} = useGetDocumentTitleList();
  const setInit = useTrie(state => state.setInit);

  useEffect(() => {
    if (data) {
      setInit(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return null;
};

export default InitTrie;
