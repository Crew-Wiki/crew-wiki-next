'use client';

import Button from '@components/common/Button';
import {route} from '@constants/route';
import * as Sentry from '@sentry/nextjs';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export default function GlobalError({error}: {error: Error & {digest?: string}}) {
  const router = useRouter();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const goToMain = () => {
    router.push(route.goDaemoon());
  };

  return (
    <html>
      <body>
        <h1 className="font-bm text-2xl text-grayscale-800">{error.message}</h1>
        <Button style="primary" size="xs" onClick={goToMain}>
          메인으로
        </Button>
      </body>
    </html>
  );
}
