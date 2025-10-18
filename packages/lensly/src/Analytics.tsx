import { useEffect, useRef } from 'react';
import type { AnalyticsProps, MiniAppContext } from './types';

const DEFAULT_ENDPOINT = 'https://api-slop.seraphim.zone/api/rest/insert';
const FALLBACK_SOURCE_TYPE = 'website';

const log = (...messages: unknown[]) => {
  if (typeof console === 'undefined') {
    return;
  }

  const sink = console.debug ?? console.log;
  sink.call(console, '[lensly]', ...messages);
};

const pickFetch = (override?: typeof fetch) => {
  if (typeof override === 'function') {
    return override;
  }
  if (typeof globalThis.fetch === 'function') {
    return globalThis.fetch.bind(globalThis);
  }
  return undefined;
};

const resolveSourceType = (context?: MiniAppContext | null) => {
  const reportedType = context?.location && typeof context.location === 'object'
    ? (context.location as { type?: string }).type
    : undefined;

  if (reportedType) {
    return {
      sourceType: reportedType,
      origin: 'location.type'
    } as const;
  }

  const clientFid = context?.client?.clientFid;
  const platformType = context?.client?.platformType;
  const inferredMiniApp = context?.inMiniApp;

  if (inferredMiniApp || clientFid != null || platformType) {
    return {
      sourceType: 'farcaster_client',
      origin: inferredMiniApp ? 'isInMiniApp' : platformType ? 'client.platformType' : 'client.clientFid'
    } as const;
  }

  return {
    sourceType: FALLBACK_SOURCE_TYPE,
    origin: 'fallback'
  } as const;
};

const buildPayload = (miniappId: string, context?: MiniAppContext | null) => {
  const { sourceType, origin } = resolveSourceType(context);
  const rawSourceType = context?.location?.type ?? null;

  const fidValue = context?.user?.fid;
  const farcasterId = fidValue != null ? String(fidValue) : '';

  return {
    payload: {
      miniappId,
      sourceType,
      farcasterId
    },
    meta: {
      rawSourceType,
      usedFallback: sourceType === FALLBACK_SOURCE_TYPE && rawSourceType !== FALLBACK_SOURCE_TYPE,
      resolvedBy: origin,
      inMiniApp: context?.inMiniApp ?? null
    }
  };
};

export const Analytics = ({
  miniappId,
  endpoint = DEFAULT_ENDPOINT,
  fetchImpl,
  onError,
  context,
  children
}: AnalyticsProps) => {
  const hasSentRef = useRef(false);

  useEffect(() => {
    if (typeof context === 'undefined') {
      log('context not resolved yet, waiting before sending');
      return;
    }

    const { payload, meta } = buildPayload(miniappId, context ?? null);

    log('analytics effect triggered', {
      hasSent: hasSentRef.current,
      location: meta.rawSourceType,
      resolvedSource: payload.sourceType,
      resolver: meta.resolvedBy,
      inMiniApp: meta.inMiniApp,
      hasFid: Boolean(payload.farcasterId)
    });

    if (hasSentRef.current) {
      log('skipping send because event already dispatched');
      return;
    }

    const fetchFn = pickFetch(fetchImpl);
    if (!fetchFn) {
      log('skipping send because fetch is unavailable');
      hasSentRef.current = true;
      return;
    }

    hasSentRef.current = true;

    if (meta.usedFallback) {
      log('context incomplete, defaulting source type to fallback', {
        fallback: payload.sourceType,
        original: meta.rawSourceType
      });
    }

    if (!payload.farcasterId) {
      log('farcaster fid missing; sending anonymous marker');
    }

    log('submitting analytics payload', payload);

    fetchFn(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(async (response) => {
        const responseText = await response.text().catch(() => '');

        if (!response.ok) {
          const errorDetails = {
            status: response.status,
            statusText: response.statusText,
            body: responseText
          };
          log('analytics delivery failed (non-ok response)', errorDetails);
          throw Object.assign(new Error(`analytics delivery failed with status ${response.status}`), {
            details: errorDetails
          });
        }

        log('analytics payload delivered', {
          status: response.status,
          body: responseText || undefined
        });
      })
      .catch((error) => {
      if (onError) {
        onError(error);
        log('analytics delivery failed (reported to onError)', error);
        return;
      }

      log('analytics delivery failed', error);
    });
  }, [context, endpoint, fetchImpl, miniappId, onError]);

  return <>{children}</>;
};
