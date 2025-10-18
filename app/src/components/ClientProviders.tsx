'use client';

import { AnalyticsProvider } from 'lensly';
import type { AnalyticsProviderProps } from 'lensly';
import type { ReactNode } from 'react';

const miniappId = process.env.NEXT_PUBLIC_MINIAPP_ID ?? 'development-miniapp';
const endpoint = process.env.NEXT_PUBLIC_LENSLY_ENDPOINT;

type ClientProvidersProps = Pick<AnalyticsProviderProps, 'children'> & {
  children: ReactNode;
};

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AnalyticsProvider miniappId={miniappId} endpoint={endpoint}>
      {children}
    </AnalyticsProvider>
  );
}
