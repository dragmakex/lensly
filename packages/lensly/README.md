# Lensly

Dead-simple analytics drop-in for Farcaster Mini Apps.

## Usage

```tsx
import { AnalyticsProvider } from 'lensly';

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider miniappId="demo-app">
      {children}
    </AnalyticsProvider>
  );
}
```

The provider fetches the Farcaster Mini App context (via the SDK), captures the first available `location.type`, and posts it to `https://api-slop.seraphim.zone/api/rest/insert` once per session. No configuration or API key required. Only valid source types (`cast_share`, `cast_embed`, `notification`, `launcher`) get forwarded; the component skips sends if the context is incomplete.

Optional props:

- `endpoint`: override the ingest endpoint (defaults to the hosted collector).
- `fetchImpl`: provide a custom fetch implementation (useful for tests).
- `onError`: observe delivery issues.

Build the package with `npm run build`.
