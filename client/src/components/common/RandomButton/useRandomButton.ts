'use client';

import {getRandomDocumentClient} from '@apis/client/document';
import {URLS} from '@constants/urls';
import {Route} from 'next';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export const useRandomButton = () => {
  const router = useRouter();

  const goRandomDocument = async () => {
    const randomDocument = await getRandomDocumentClient();
    const randomUUID = randomDocument.documentUUID;

    router.push(`${URLS.wiki}/${randomUUID}` as Route);
  };

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  useEffect(function addEventListenerForDetectWindowSize() {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    goRandomDocument,
    isMobile,
  };
};
