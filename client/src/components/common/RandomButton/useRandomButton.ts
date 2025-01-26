'use client';

import {getRandomDocument} from '@apis/document';
import {URLS} from '@constants/urls';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

export const useRandomButton = () => {
  const router = useRouter();

  const goRandomDocument = async () => {
    const randomTitle = await getRandomDocument();
    router.push(`${URLS.wiki}/${randomTitle}`);
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
