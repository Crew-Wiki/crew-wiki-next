'use client';

import {useEffect} from 'react';

export const AttachTocClickHandler = () => {
  useEffect(() => {
    const scrollToHeading = (hash: string) => {
      const contents = document.querySelector('.toastui-editor-contents') as HTMLElement;
      if (!contents) return;

      const heading = contents.querySelector(`[data-id="${hash.slice(1)}"]`);
      if (heading) {
        heading.scrollIntoView({behavior: 'smooth', block: 'center'});
      }
    };

    if (window.location.hash) {
      scrollToHeading(window.location.hash);
    }

    const handleHashChange = () => {
      if (window.location.hash) {
        scrollToHeading(window.location.hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return null;
};
