import type { Context } from '@farcaster/miniapp-core';
import type { ReactNode } from 'react';

export type MiniAppContext = Context.MiniAppContext;

export interface AnalyticsProps {
  miniappId: string;
  endpoint?: string;
  fetchImpl?: typeof fetch;
  onError?: (error: unknown) => void;
  context?: MiniAppContext | null;
  children?: ReactNode;
}

export type AnalyticsProviderProps = Omit<AnalyticsProps, 'context'>;




