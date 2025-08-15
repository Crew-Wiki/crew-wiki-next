'use client';

import {useGetDocumentTitleList} from '@hooks/fetch/useGetDocumentTitleList';
import {useTrie} from '@store/trie';
import {useEffect} from 'react';

const InitTrie = () => {
  const {titles, uuids} = useGetDocumentTitleList();
  const setInit = useTrie(state => state.setInit);

  useEffect(() => {
    setInit(titles.map((title, index) => ({title, uuid: uuids[index]})));
  }, [titles, uuids]);

  return null;
};

export default InitTrie;
