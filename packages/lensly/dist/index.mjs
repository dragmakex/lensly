// src/Analytics.tsx
import { useEffect, useRef } from "react";
import { Fragment, jsx } from "react/jsx-runtime";
var DEFAULT_ENDPOINT = "https://api-slop.seraphim.zone/api/rest/insert";
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
var resolveSourceType = (context) => {
  const reportedType = context?.location && typeof context.location === "object" ? context.location.type : void 0;
  if (reportedType) {
    return {
      sourceType: reportedType,
      origin: "location.type"
    };
  }
  const clientFid = context?.client?.clientFid;
  const platformType = context?.client?.platformType;
  const inferredMiniApp = context?.inMiniApp;
  if (inferredMiniApp || clientFid != null || platformType) {
    return {
      sourceType: "farcaster_client",
      origin: inferredMiniApp ? "isInMiniApp" : platformType ? "client.platformType" : "client.clientFid"
    };
  }
  return {
    sourceType: FALLBACK_SOURCE_TYPE,
    origin: "fallback"
  };
};
var buildPayload = (miniappId, context) => {
  const { sourceType, origin } = resolveSourceType(context);
  const rawSourceType = context?.location?.type ?? null;
  const fidValue = context?.user?.fid;
  const farcasterId = fidValue != null ? String(fidValue) : "";
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
      resolver: meta.resolvedBy,
      inMiniApp: meta.inMiniApp,
      hasFid: Boolean(payload.farcasterId)
    });
    const expectingMiniAppData = context !== null && context?.inMiniApp !== false;
    if (expectingMiniAppData && !payload.farcasterId) {
      log("deferring analytics send until Farcaster fid is available");
      return;
    }
    if (expectingMiniAppData && payload.sourceType === FALLBACK_SOURCE_TYPE) {
      log("deferring analytics send until source type resolves");
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
    if (!payload.farcasterId) {
      log("farcaster fid missing; sending anonymous marker");
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
    let resolved = false;
    const fallbackTimer = setTimeout(() => {
      if (cancelled || resolved) {
        return;
      }
      log2("context fetch timed out; falling back to non-miniapp context");
      setContext({ inMiniApp: false });
    }, 2500);
    const populateContext = async () => {
      try {
        const [result, miniAppFlag] = await Promise.all([
          sdk.context.catch((error) => {
            log2("sdk.context rejected", error);
            return null;
          }),
          sdk.isInMiniApp().catch((error) => {
            log2("sdk.isInMiniApp rejected", error);
            return void 0;
          })
        ]);
        if (cancelled) {
          return;
        }
        resolved = true;
        clearTimeout(fallbackTimer);
        if (!result) {
          setContext({ inMiniApp: miniAppFlag ?? false });
          log2("mini app context unavailable; using inferred flag", {
            inMiniApp: miniAppFlag ?? false
          });
          return;
        }
        const sanitized = {
          location: result.location ?? void 0,
          user: result.user?.fid != null ? { fid: result.user.fid } : void 0,
          client: result.client ? {
            clientFid: result.client.clientFid,
            platformType: result.client.platformType ?? null
          } : void 0,
          inMiniApp: miniAppFlag
        };
        setContext(sanitized);
        log2("mini app context captured", {
          location: sanitized.location?.type,
          hasFid: sanitized.user?.fid != null,
          inMiniApp: miniAppFlag
        });
      } catch (error) {
        if (cancelled) {
          return;
        }
        clearTimeout(fallbackTimer);
        log2("failed to fetch mini app context", error);
        setContext({ inMiniApp: false });
      }
    };
    populateContext();
    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
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