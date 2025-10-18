import * as react_jsx_runtime from 'react/jsx-runtime';
import { Context } from '@farcaster/miniapp-core';
import { ReactNode } from 'react';

type MiniAppContext = Context.MiniAppContext;
interface AnalyticsProps {
    miniappId: string;
    endpoint?: string;
    fetchImpl?: typeof fetch;
    onError?: (error: unknown) => void;
    context?: MiniAppContext | null;
    children?: ReactNode;
}
type AnalyticsProviderProps = Omit<AnalyticsProps, 'context'>;

declare const Analytics: ({ miniappId, endpoint, fetchImpl, onError, context, children }: AnalyticsProps) => react_jsx_runtime.JSX.Element;

declare const AnalyticsProvider: ({ miniappId, endpoint, fetchImpl, onError, children }: AnalyticsProviderProps) => react_jsx_runtime.JSX.Element;

export { type AnalyticsProps, AnalyticsProvider, type AnalyticsProviderProps, Analytics as default };
