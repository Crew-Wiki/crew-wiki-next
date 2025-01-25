'use client';

const FloatingButton = () => {
  const moveToTheTop = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <svg
      className={'drop-shadow-lg fixed bottom-8 right-8 cursor-pointer md:bottom-12 md:right-12'}
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={moveToTheTop}
    >
      <g clipPath="url(#clip0_542_1513)">
        <circle cx="18" cy="18" r="18" fill="#25B4B9" />
        <path
          d="M27 15L18 6M18 6L9 15M18 6V30"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_542_1513">
          <rect width="36" height="36" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FloatingButton;
