'use client';

import { AnalyticsProvider } from '@sen-com/lensly';
import type { AnalyticsProviderProps } from '@sen-com/lensly';
import type { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/wagmi';
import FarcasterSDKProvider from './FarcasterSDKProvider';

const miniappId = process.env.NEXT_PUBLIC_MINIAPP_ID ?? 'development-miniapp';
const endpoint = process.env.NEXT_PUBLIC_LENSLY_ENDPOINT;

const queryClient = new QueryClient();

type ClientProvidersProps = Pick<AnalyticsProviderProps, 'children'> & {
  children: ReactNode;
};

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AnalyticsProvider miniappId={miniappId} endpoint={endpoint}>
          <FarcasterSDKProvider />
          {children}
        </AnalyticsProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
