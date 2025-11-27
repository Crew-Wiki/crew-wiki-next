'use client';

import {route} from '@constants/route';
import {Route} from 'next';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {twMerge} from 'tailwind-merge';
import {useModal} from '@components/common/Modal/useModal';
import {Modal} from '@components/common/Modal/Modal';
import {deleteFrontendServerCache} from '@apis/client/admin';

interface MenuItem {
  label: string;
  href: Route;
  icon: string;
}

const Index = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {label: '대시보드', href: route.goAdminDashboard(), icon: '📊'},
    {label: '문서 관리', href: route.goAdminDocument(), icon: '📄'},
  ];

  const isActive = (href: string) => pathname === href;

  const {
    open: openDeleteCacheConfirm,
    close: closeDeleteCacheConfirm,
    component: deleteCacheConfirm,
  } = useModal<boolean>(
    <Modal>
      <div className="gap1 flex flex-col gap-8">
        <p className="font-pretendard text-lg">정말 캐시를 삭제하시겠습니까?</p>
        <div className="flex w-full flex-row justify-between gap-3">
          <button
            className="flex-1 rounded-xl bg-primary-300 px-2 py-3 text-white"
            type="button"
            onClick={() => closeDeleteCacheConfirm(true)}
          >
            삭제
          </button>
          <button
            className="flex-1 rounded-xl bg-neutral-300 px-2 py-3"
            type="button"
            onClick={() => closeDeleteCacheConfirm(false)}
          >
            취소
          </button>
        </div>
      </div>
    </Modal>,
    {closeOnClickBackdrop: false},
  );

  const onClickDeleteCacheButton = async () => {
    const shouldDeleteCache = await openDeleteCacheConfirm();
    if (shouldDeleteCache) {
      await deleteFrontendServerCache();
      alert('성공적으로 캐시 데이터를 삭제했습니다.');
    }
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-grayscale-50 shadow-lg">
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={twMerge(
                  'flex items-center gap-3 rounded-lg px-4 py-3 font-pretendard text-sm transition-colors',
                  isActive(item.href) ? 'bg-primary-primary text-white' : 'text-grayscale-700 hover:bg-grayscale-100',
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-grayscale-200 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-pretendard text-sm text-grayscale-700 transition-colors hover:bg-grayscale-100"
          onClick={() => {
            // TODO: 로그아웃 기능 구현
            console.log('로그아웃');
          }}
        >
          로그아웃
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-pretendard text-sm text-grayscale-700 transition-colors hover:bg-grayscale-100"
          onClick={onClickDeleteCacheButton}
        >
          캐시 삭제
        </button>
      </div>
      {deleteCacheConfirm}
    </aside>
  );
};

export default Index;
