// src/Analytics.tsx
import { useEffect, useRef } from "react";
import { Fragment, jsx } from "react/jsx-runtime";
var DEFAULT_ENDPOINT = "https://api-slop.seraphim.zone/api/rest/insert-next";
var FALLBACK_SOURCE_TYPE = "website";
var log = (...messages) => {
  if (typeof console === "undefined") {
    return;
  }
  const sink = console.debug ?? console.log;
  sink.call(console, "[lensly]", ...messages);
};
var pickFetch = (override) => {
  if (typeof override === "function") {
    return override;
  }
  if (typeof globalThis.fetch === "function") {
    return globalThis.fetch.bind(globalThis);
  }
  return void 0;
};
var buildPayload = (miniappId, context) => {
  const rawSourceType = context?.location?.type ?? null;
  const sourceType = rawSourceType ?? FALLBACK_SOURCE_TYPE;
  const fidValue = context?.user?.fid;
  const farcasterId = fidValue != null ? String(fidValue) : null;
  const userData = farcasterId ? {
    data: {
      farcaster_id: farcasterId,
      ...context?.user?.username ? { username: context.user.username } : {},
      ...context?.user?.displayName ? { displayName: context.user.displayName } : {},
      ...context?.user?.pfpUrl ? { pfpUrl: context.user.pfpUrl } : {}
    },
    on_conflict: {
      constraint: "users_farcaster_id_key",
      update_columns: ["username", "displayName", "pfpUrl"]
    }
  } : null;
  const featuresHaptics = context?.features?.haptics;
  const featuresCameraAndMic = context?.features?.cameraAndMicrophoneAccess;
  const clientPlatformType = context?.client?.platformType;
  const clientFarcasterId = context?.client?.clientFid;
  const payload = {
    miniappId,
    sourceType,
    farcasterId: farcasterId ?? ""
  };
  if (featuresHaptics !== void 0) {
    payload.featuresHaptics = featuresHaptics;
  }
  if (featuresCameraAndMic !== void 0) {
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
var Analytics = ({
  miniappId,
  endpoint = DEFAULT_ENDPOINT,
  fetchImpl,
  onError,
  context,
  children
}) => {
  const hasSentRef = useRef(false);
  useEffect(() => {
    if (typeof context === "undefined") {
      log("context not resolved yet, waiting before sending");
      return;
    }
    const { payload, meta } = buildPayload(miniappId, context ?? null);
    log("analytics effect triggered", {
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
      log("skipping analytics send until farcaster fid is available");
      return;
    }
    if (hasSentRef.current) {
      log("skipping send because event already dispatched");
      return;
    }
    const fetchFn = pickFetch(fetchImpl);
    if (!fetchFn) {
      log("skipping send because fetch is unavailable");
      hasSentRef.current = true;
      return;
    }
    hasSentRef.current = true;
    if (meta.usedFallback) {
      log("context incomplete, defaulting source type to fallback", {
        fallback: payload.sourceType,
        original: meta.rawSourceType
      });
    }
    log("submitting analytics payload", payload);
    fetchFn(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(async (response) => {
      const responseText = await response.text().catch(() => "");
      if (!response.ok) {
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        };
        log("analytics delivery failed (non-ok response)", errorDetails);
        throw Object.assign(new Error(`analytics delivery failed with status ${response.status}`), {
          details: errorDetails
        });
      }
      log("analytics payload delivered", {
        status: response.status,
        body: responseText || void 0
      });
    }).catch((error) => {
      if (onError) {
        onError(error);
        log("analytics delivery failed (reported to onError)", error);
        return;
      }
      log("analytics delivery failed", error);
    });
  }, [context, endpoint, fetchImpl, miniappId, onError]);
  return /* @__PURE__ */ jsx(Fragment, { children });
};

// src/provider.tsx
import { useEffect as useEffect2, useState } from "react";
import sdk from "@farcaster/miniapp-sdk";
import { jsx as jsx2 } from "react/jsx-runtime";
var log2 = (...messages) => {
  if (typeof console === "undefined") {
    return;
  }
  const sink = console.debug ?? console.log;
  sink.call(console, "[lensly]", ...messages);
};
var AnalyticsProvider = ({
  miniappId,
  endpoint,
  fetchImpl,
  onError,
  children
}) => {
  const [context, setContext] = useState(void 0);
  useEffect2(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) {
        log2("context fetch timed out, sending fallback payload");
        setContext(null);
      }
    }, 1500);
    const populateContext = async () => {
      try {
        const result = await sdk.context;
        if (!cancelled) {
          setContext(result);
          log2("mini app context captured", result);
          clearTimeout(timeout);
        }
      } catch (error) {
        log2("failed to fetch mini app context", error);
        if (!cancelled) {
          setContext(null);
        }
      }
    };
    populateContext();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      log2("mini app context fetch cancelled");
    };
  }, []);
  return /* @__PURE__ */ jsx2(
    Analytics,
    {
      miniappId,
      endpoint,
      fetchImpl,
      onError,
      context,
      children
    }
  );
};
export {
  AnalyticsProvider,
  Analytics as default
};
//# sourceMappingURL=index.mjs.map