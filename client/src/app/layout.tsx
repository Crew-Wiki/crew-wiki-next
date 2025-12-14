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
    images: `${process.env.NEXT_PUBLIC_CDN_DOMAIN}/images/daemoon.png`,
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
    <html
      lang="ko"
      className={`${pretendard.variable} scroll-pt-[50vh] scroll-smooth`}
      style={{backgroundColor: '#f3f4f6'}}
      data-version="3.1.3"
    >
      <body className={bm.variable}>
        {children}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
