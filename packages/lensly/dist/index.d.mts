import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

type MiniAppContext = {
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
interface AnalyticsProps {
    miniappId: string;
    endpoint?: string;
    fetchImpl?: typeof fetch;
    onError?: (error: unknown) => void;
    context?: MiniAppContext | null;
    children?: ReactNode;
}
interface AnalyticsProviderProps extends Omit<AnalyticsProps, 'context'> {
}

declare const Analytics: ({ miniappId, endpoint, fetchImpl, onError, context, children }: AnalyticsProps) => react_jsx_runtime.JSX.Element;

declare const AnalyticsProvider: ({ miniappId, endpoint, fetchImpl, onError, children }: AnalyticsProviderProps) => react_jsx_runtime.JSX.Element;

export { type AnalyticsProps, AnalyticsProvider, type AnalyticsProviderProps, Analytics as default };
