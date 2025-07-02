import Image from 'next/image';
import Link from 'next/link';

const AdminHeader = () => {
  return (
    <nav className="sticky top-0 flex bg-primary-primary px-4 py-2">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/hangseong-white.png`}
            alt="logo"
            className="h-10 w-8 md:h-16 md:w-14"
          />
          <h1 className="font-bm text-2xl font-normal text-white md:text-[40px]">크루위키</h1>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-end font-bm text-2xl md:text-[30px]">관리자 페이지</div>
    </nav>
  );
};

export default AdminHeader;
