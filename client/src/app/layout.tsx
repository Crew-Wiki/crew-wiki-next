import type {Metadata, Viewport} from 'next';
import localFont from 'next/font/local';
import './globals.css';

// font preloading reference https://deswaq.tistory.com/54
const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
});

const bm = localFont({
  src: '../../public/fonts/BMHANNAProOTF.otf',
  display: 'swap',
  weight: '400',
  variable: '--font-bm',
});

export const metadata: Metadata = {
  applicationName: 'crew-wiki',
  title: '크루위키',
  description: '우아한테크코스 크루들의 정보들을 담은 위키',
  openGraph: {
    url: 'https://crew-wiki.site',
    title: '크루위키',
    type: 'website',
    description: '우아한테크코스 크루들의 정보들을 담은 위키',
    images:
      'https://wootecowikibucket.s3.ap-northeast-2.amazonaws.com/%EB%8C%80%EB%AC%B8%EC%82%AC%EC%A7%84/%E1%84%83%E1%85%A2%E1%84%86%E1%85%AE%E1%86%AB.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable} style={{backgroundColor: '#f3f4f6'}}>
      <body className={bm.variable}>{children}</body>
    </html>
  );
}
