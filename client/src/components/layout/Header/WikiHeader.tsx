'use client';

import Link from 'next/link';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {twMerge} from 'tailwind-merge';
import WikiInputField from './WikiInputField';

import dynamic from 'next/dynamic';
const RightHeader = dynamic(() => import('./RightHeader'), {ssr: false});

interface ScrollPosition {
  prev: number;
  current: number;
}

const WikiHeader = () => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    prev: 0,
    current: 0,
  });

  const [showHeader, setShowHeader] = useState(true);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrollPosition({prev: scrollPosition.current, current: window.scrollY});
      setShowHeader(scrollPosition.prev >= scrollPosition.current);
      if (window.scrollY < 50) {
        setShowHeader(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);

  const ESTIMATED_HEADER_HEIGHT = 160;
  useEffect(() => {
    if (showHeader) {
      setY(0);
    } else {
      setY(-ESTIMATED_HEADER_HEIGHT);
    }
  }, [showHeader]);

  const [isVisibleSmallSearchBar, setVisibleSmallSearchBar] = useState(false);

  const toggleVisibility = () => {
    setVisibleSmallSearchBar(!isVisibleSmallSearchBar);
  };

  const onSubmit = () => {
    setVisibleSmallSearchBar(false);
  };

  return (
    <motion.div className="sticky top-0 z-50 w-full bg-primary-primary" animate={{y}} transition={{duration: 0.3}}>
      <div className="flex flex-col items-center justify-center py-2">
        <div className="header-container flex w-full max-w-[1440px] flex-row items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/hangseong-white.png`}
              width={32}
              height={32}
              alt="logo"
              className="h-10 w-8 md:h-16 md:w-14"
            />
            <h1 className="font-bm text-2xl font-normal text-white md:text-[40px]">크루위키</h1>
          </Link>

          <RightHeader onSubmit={onSubmit} toggleVisibility={toggleVisibility} />
        </div>
        <div
          className={twMerge(
            'flex w-full items-center px-4 pb-2 pt-4 md:hidden',
            isVisibleSmallSearchBar ? '' : 'hidden',
          )}
        >
          <WikiInputField className="w-full" handleSubmit={onSubmit} />
        </div>
      </div>
    </motion.div>
  );
};

export default WikiHeader;
