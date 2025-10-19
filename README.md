# Lensly

**Lensly is the Analytics Hub for Farcaster Applications.** It captures application context, builds comprehensive user profiles, and ships real-time insights about the entire Mini App ecosystem.

## Executive Summary

- **Problem**: Mini Apps lack drop-in analytics that understand Farcaster-native data.
- **Solution**: Lensly SDK collects deep Farcaster Application usage metrics and conveniently surfaces them in a user-facing dashboard.
- **Impact**: Developers embed one provider, founders open a dashboard, judges see live data and user growth.

Check it out [here](https://farcaster.xyz/~/mini-apps/launch?domain=lensly.seraphim.zone)!

## Repository Structure

- [Lensly App](./app/): contains the lensly app.
- [Lensly SDK](./packages/lensly/): contains the lensly sdk package.
- [Infra](./infra/): contains lensly infrastructure.
- [Docs](./docs/): features product, engineering, guides, and design documentation.

## Quick Start

Install required dependencies:
```bash
# You might have to authenticate to GitHub Packages via NODE_AUTH_TOKEN
npm install @sen-com/lensly
```

Integrate the lensly sdk in your layout:
```typescript
import { AnalyticsProvider } from '@sen-com/lensly';

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider miniappId="demo-app">
      {children}
    </AnalyticsProvider>
  );
}
```

For more information check out our [integration guide](./docs/docs/developer-guide.md).

## Important Links

- [Demo](https://youtube.com/shorts/l37PzlkKhU0)
- [Website](https://lensly.seraphim.zone)
- [Mini App]([here](https://farcaster.xyz/~/mini-apps/launch?domain=lensly.seraphim.zone)

---

All Rights Reserved!
