// src/LenslyAnalytics.tsx
import { useEffect, useRef, useState } from "react";
import sdk from "@farcaster/miniapp-sdk";
var ENDPOINT = "https://lensly.seraphim.zone/api/ingest";
var LenslyAnalytics = ({ appId }) => {
  const hasSentRef = useRef(false);
  const [appContext, setAppContext] = useState(
    null
  );
  useEffect(() => {
    sdk.context.then(setAppContext).catch(console.log);
  }, []);
  useEffect(() => {
    if (hasSentRef.current) {
      console.log("[lensly] context already sent");
      return;
    }
    if (!appContext) {
      console.log("[lensly] no application context found");
      return;
    }
    console.log("[lensly] application context:", appContext);
    fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        request_context: { app_id: appId },
        farcaster_context: appContext
      })
    });
    hasSentRef.current = true;
  }, [appId, appContext]);
  return null;
};
export {
  LenslyAnalytics
};
//# sourceMappingURL=index.mjs.map