"use client";

import { LenslyAnalytics } from "@sen-com/lensly";
import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/wagmi";
import FarcasterSDKProvider from "./FarcasterSDKProvider";

const queryClient = new QueryClient();

type ClientProvidersProps = {
  children: ReactNode;
};

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FarcasterSDKProvider />
        <LenslyAnalytics appId="74828420-f1e9-4965-8f26-c3e5ab5a7c9d" />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
