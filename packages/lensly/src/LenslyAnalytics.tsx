import { useEffect, useState } from "react";
import sdk from "@farcaster/miniapp-sdk";
import { Context } from "@farcaster/miniapp-core";
import type { LenslyAnalyticsProps } from "./types";

const ENDPOINT = "https://lensly.seraphim.zone/api/ingest";
let hasSentForSession = false;

export const LenslyAnalytics = ({ appId }: LenslyAnalyticsProps) => {
  const [appContext, setAppContext] = useState<Context.MiniAppContext | null>(
    null
  );

  useEffect(() => {
    sdk.context.then(setAppContext).catch(console.log);
  }, []);

  useEffect(() => {
    if (!appContext) {
      console.log("[lensly] no application context found");
      return;
    }

    if (hasSentForSession) {
      console.log("[lensly] context already recorded for this session");
      return;
    }

    console.log("[lensly] application context:", appContext);

    fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request_context: { app_id: appId },
        farcaster_context: appContext,
      }),
    });

    hasSentForSession = true;
  }, [appId, appContext]);

  return null;
};
