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
    let resolved = false;

    const fallbackTimer = setTimeout(() => {
      if (cancelled || resolved) {
        return;
      }
      log('context fetch timed out; falling back to non-miniapp context');
      setContext({ inMiniApp: false });
    }, 2500);

    const populateContext = async () => {
      try {
        const [result, miniAppFlag] = await Promise.all([
          sdk.context.catch((error) => {
            log('sdk.context rejected', error);
            return null;
          }),
          sdk.isInMiniApp().catch((error) => {
            log('sdk.isInMiniApp rejected', error);
            return undefined;
          })
        ]);

        if (cancelled) {
          return;
        }

        resolved = true;
        clearTimeout(fallbackTimer);

        if (!result) {
          setContext({ inMiniApp: miniAppFlag ?? false });
          log('mini app context unavailable; using inferred flag', {
            inMiniApp: miniAppFlag ?? false
          });
          return;
        }

        const sanitized: MiniAppContext = {
          location: result.location ?? undefined,
          user: result.user?.fid != null ? { fid: result.user.fid } : undefined,
          client: result.client
            ? {
                clientFid: result.client.clientFid,
                platformType: result.client.platformType ?? null
              }
            : undefined,
          inMiniApp: miniAppFlag
        };

        setContext(sanitized);
        log('mini app context captured', {
          location: sanitized.location?.type,
          hasFid: sanitized.user?.fid != null,
          inMiniApp: miniAppFlag
        });
      } catch (error) {
        if (cancelled) {
          return;
        }
        clearTimeout(fallbackTimer);
        log('failed to fetch mini app context', error);
        setContext({ inMiniApp: false });
      }
    };

    populateContext();

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
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
