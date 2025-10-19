import { useEffect, useRef } from 'react';
import type { AnalyticsProps, MiniAppContext } from './types';

const DEFAULT_ENDPOINT = 'https://api-slop.seraphim.zone/api/rest/insert-next';
const FALLBACK_SOURCE_TYPE = 'website';

type InsertNextPayload = {
  miniappId: string;
  sourceType: string;
  farcasterId: string;
  featuresHaptics?: boolean;
  featuresCameraAndMic?: boolean;
  clientPlatformType?: string;
  clientFarcasterId?: number;
  user?: {
    data: {
      farcaster_id: string;
      username?: string;
      displayName?: string;
      pfpUrl?: string;
    };
    on_conflict: {
      constraint: 'users_farcaster_id_key';
      update_columns: ReadonlyArray<'username' | 'displayName' | 'pfpUrl'>;
    };
  };
};

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

const buildPayload = (miniappId: string, context?: MiniAppContext | null) => {
  const rawSourceType = context?.location?.type ?? null;
  const sourceType = rawSourceType ?? FALLBACK_SOURCE_TYPE;

  const fidValue = context?.user?.fid;
  const farcasterId = fidValue != null ? String(fidValue) : null;

  const userData = farcasterId
    ? {
        data: {
          farcaster_id: farcasterId,
          ...(context?.user?.username ? { username: context.user.username } : {}),
          ...(context?.user?.displayName ? { displayName: context.user.displayName } : {}),
          ...(context?.user?.pfpUrl ? { pfpUrl: context.user.pfpUrl } : {})
        },
        on_conflict: {
          constraint: 'users_farcaster_id_key' as const,
          update_columns: ['username', 'displayName', 'pfpUrl'] as const
        }
      }
    : null;

  const featuresHaptics = context?.features?.haptics;
  const featuresCameraAndMic = context?.features?.cameraAndMicrophoneAccess;

  const clientPlatformType = context?.client?.platformType;
  const clientFarcasterId = context?.client?.clientFid;

  const payload: InsertNextPayload = {
    miniappId,
    sourceType,
    farcasterId: farcasterId ?? ''
  };

  if (featuresHaptics !== undefined) {
    payload.featuresHaptics = featuresHaptics;
  }

  if (featuresCameraAndMic !== undefined) {
    payload.featuresCameraAndMic = featuresCameraAndMic;
  }

  if (clientPlatformType) {
    payload.clientPlatformType = clientPlatformType;
  }

  if (clientFarcasterId != null) {
    payload.clientFarcasterId = clientFarcasterId;
  }

  if (userData) {
    payload.user = userData;
  }

  return {
    payload,
    meta: {
      rawSourceType,
      usedFallback: rawSourceType == null,
      hasFid: Boolean(farcasterId)
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
      hasFid: meta.hasFid,
      featuresHaptics: payload.featuresHaptics,
      featuresCameraAndMic: payload.featuresCameraAndMic,
      clientPlatformType: payload.clientPlatformType,
      clientFarcasterId: payload.clientFarcasterId
    });

    if (!meta.hasFid) {
      log('skipping analytics send until farcaster fid is available');
      return;
    }

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