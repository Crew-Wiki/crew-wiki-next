'use client';

import Link from 'next/link';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import SearchCircleSmall from '@app/image/search-circle.svg';
import LogoImage from '@app/image/hangseong-white.png';
import {twMerge} from 'tailwind-merge';
import WikiInputField from './WikiInputField';
import RandomButton from '@components/common/RandomButton';

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

  const onSubmit = (event: React.FormEvent) => {
    setVisibleSmallSearchBar(false);
  };

  return (
    <motion.div className="sticky z-50 top-0 w-full bg-primary-primary " animate={{y}} transition={{duration: 0.3}}>
      <div className="flex flex-col justify-center items-center py-2">
        <div className="flex flex-row justify-between items-center px-4 header-container max-w-[1440px] w-full">
          <Link href="/" className="flex gap-2 items-center">
            <Image src={LogoImage} alt="logo" className="w-8 h-10 md:h-16 md:w-14" />
            <h1 className="font-bm text-2xl md:text-[40px] text-white font-normal">크루위키</h1>
          </Link>

          <div className="flex items-center">
            <RandomButton />
            <WikiInputField className="w-80 hidden md:flex" handleSubmit={onSubmit} />
            <Image
              src={SearchCircleSmall}
              alt="search"
              className="cursor-pointer md:hidden"
              onClick={toggleVisibility}
            />
          </div>
        </div>
        <div
          className={twMerge(
            'flex px-4 pt-4 pb-2 w-full items-center md:hidden',
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
