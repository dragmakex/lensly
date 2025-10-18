import type { ReactNode } from 'react';

export type MiniAppContext = {
  location?: {
    type?: string;
    [key: string]: unknown;
  } | null;
  user?: {
    fid?: string | number | null;
  };
  client?: {
    clientFid?: string | number | null;
    platformType?: string | null;
  };
  inMiniApp?: boolean
};

export interface AnalyticsProps {
  miniappId: string;
  endpoint?: string;
  fetchImpl?: typeof fetch;
  onError?: (error: unknown) => void;
  context?: MiniAppContext | null;
  children?: ReactNode;
}

export type AnalyticsProviderProps = Omit<AnalyticsProps, 'context'>;
