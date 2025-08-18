'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {twMerge} from 'tailwind-merge';

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

const Index = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {label: '대시보드', href: '/admin/dashboard', icon: '📊'},
    {label: '문서 관리', href: '/admin/documents', icon: '📄'},
  ];

  const isActive = (href: string) => pathname === href;

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
      </div>
    </aside>
  );
};

export default Index;
