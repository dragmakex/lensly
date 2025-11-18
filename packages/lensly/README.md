# Lensly

Dead-simple analytics drop-in for Farcaster Mini Apps.

## Usage

```tsx
"use client";

import { LenslyAnalytics } from "@g2f/lensly";
import FarcasterSDKProvider from "./FarcasterSDKProvider";

export function Layout({ children }: { children: React.ReactNode }) {
 return (
  <>
    <FarcasterSDKProvider />
    <LenslyAnalytics appId="74828420-f1e9-4965-8f26-c3e5ab5a7c9d" />
    {children}
  </>
  )
}
```
