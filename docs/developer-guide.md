# Developer Guide

Lensly ships a React provider that captures Farcaster Mini App context and posts a single analytics event per session. Follow the steps below to drop it into your app.

## Install the SDK

```bash
# Authenticate to GitHub Packages via NODE_AUTH_TOKEN, then:
npm install @sen-com/lensly
```

If your project does not already depend on the Farcaster SDK, install it as well:

```bash
npm install @farcaster/miniapp-sdk
```

## Wrap Your App

Embed the `AnalyticsProvider` high in your component tree so it mounts once per user session. Provide a stable `miniappId` that matches the app registered with Lensly.

```tsx
import { AnalyticsProvider } from '@sen-com/lensly';

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider miniappId="demo-app">
      {children}
    </AnalyticsProvider>
  );
}
```

## Optional Configuration

- `endpoint`: point to a self-hosted collector instead of the managed endpoint.
- `fetchImpl`: inject a custom fetch (handy for environments without `globalThis.fetch`).
- `onError`: observe delivery failures and surface them to your logging pipeline.

## Verify Delivery

1. Load the mini app in a Farcaster host and interact once.
2. Ensure the console logs show `[lensly] analytics payload delivered`.
3. Confirm the session appears in the Lensly dashboard or ingest traces.
