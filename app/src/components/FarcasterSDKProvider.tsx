"use client";

import { useEffect } from "react";
import sdk from "@farcaster/miniapp-sdk";

export default function FarcasterSDKProvider() {
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        await sdk.context;
        sdk.actions.ready();
      } catch {
        // Silent error handling for production
      }
    };

    const timer = setTimeout(initializeSDK, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}