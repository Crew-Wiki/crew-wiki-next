import Image from 'next/image';
import Link from 'next/link';

const AdminHeader = () => {
  return (
    <nav className="sticky top-0 flex bg-primary-primary px-4 py-2">
      <div className="flex items-center justify-between">
        <Link href="/admin/login" className="flex items-center gap-2">
          <Image
            src={`${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/hangseong-white.png`}
            width={32}
            height={32}
            alt="logo"
            className="w-8 h-10 md:h-16 md:w-14"
          />
          <h1 className="font-bm text-2xl md:text-[40px] text-white font-normal">크루위키</h1>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-end font-bm text-2xl md:text-[40px] text-white font-normal">관리자 페이지</div>
    </nav>
  );
};

export default AdminHeader;
