'use client';

import {getRandomDocumentClient} from '@apis/client/document';
import {route} from '@constants/route';
import {useFetch} from '@hooks/useFetch';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export const useRandomButton = () => {
  const router = useRouter();
  const {refetch: fetchRandom, isLoading} = useFetch(getRandomDocumentClient, {enabled: false});

  const goRandomDocument = async () => {
    const randomDocument = await fetchRandom();
    if (!randomDocument) {
      return;
    }

    const randomUUID = randomDocument.documentUUID;

    router.push(route.goWiki(randomUUID));
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
    isLoading,
  };
};
