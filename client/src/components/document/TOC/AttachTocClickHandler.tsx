'use client';

import {useEffect} from 'react';

export const AttachTocClickHandler = () => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const index = target.dataset.index || target.closest('li')?.dataset.index;

      if (index !== undefined) {
        const contents = document.querySelector('.toastui-editor-contents') as HTMLElement;
        const headings = contents.querySelectorAll('h1, h2, h3');
        const heading = headings[parseInt(index, 10)];

        if (heading) {
          heading.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
      }
    };

    const toc = document.querySelector('aside ul') as HTMLElement;
    toc?.addEventListener('click', handleClick);

    return () => {
      toc?.removeEventListener('click', handleClick);
    };
  });

  return null;
};
