import { useEffect, useState } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { Analytics } from './Analytics';
import type { AnalyticsProviderProps, MiniAppContext } from './types';

const log = (...messages: unknown[]) => {
  if (typeof console === 'undefined') {
    return;
  }

  const sink = console.debug ?? console.log;
  sink.call(console, '[lensly]', ...messages);
};

export const AnalyticsProvider = ({
  miniappId,
  endpoint,
  fetchImpl,
  onError,
  children
}: AnalyticsProviderProps) => {
  const [context, setContext] = useState<MiniAppContext | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) {
        log('context fetch timed out, sending fallback payload');
        setContext({ inMiniApp: undefined });
      }
    }, 2500);

    const populateContext = async () => {
      try {
        const [result, inMiniApp] = await Promise.all([
          sdk.context.catch(() => null),
          sdk.isInMiniApp().catch(() => false)
        ]);
        if (!cancelled) {
          const sanitized: MiniAppContext = {
            location: result?.location ?? undefined,
            user: result?.user?.fid != null ? { fid: result.user.fid } : undefined,
            client: result?.client
              ? {
                  clientFid: result.client.clientFid,
                  platformType: result.client.platformType
                }
              : undefined,
            inMiniApp
          };

          setContext(sanitized);
          log('mini app context captured', {
            location: sanitized.location?.type,
            hasFid: sanitized.user?.fid != null,
            inMiniApp
          });
          clearTimeout(timeout);
        }
      } catch (error) {
        log('failed to fetch mini app context', error);
        if (!cancelled) {
          setContext({ inMiniApp: undefined });
        }
      }
    };

    populateContext();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      log('mini app context fetch cancelled');
    };
  }, []);

  return (
    <Analytics
      miniappId={miniappId}
      endpoint={endpoint}
      fetchImpl={fetchImpl}
      onError={onError}
      context={context}
    >
      {children}
    </Analytics>
  );
};
