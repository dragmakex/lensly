import type { ReactNode } from 'react';

export type MiniAppContext = {
  location?: {
    type?: string;
  };
  user?: {
    fid?: string | number | null;
  };
  client?: {
    clientFid?: string | number | null;
  };
};

export interface AnalyticsProps {
  miniappId: string;
  endpoint?: string;
  fetchImpl?: typeof fetch;
  onError?: (error: unknown) => void;
  context?: MiniAppContext | null;
  children?: ReactNode;
}

export interface AnalyticsProviderProps extends Omit<AnalyticsProps, 'context'> {}
