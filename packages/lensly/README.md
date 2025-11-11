# Lensly

Dead-simple analytics drop-in for Farcaster Mini Apps.

## Usage

```tsx
"use client";
import { LenslyAnalytics } from "@g2f/lensly";

export function Layout({ children }: { children: React.ReactNode }) {
  return <LenslyAnalytics appId="<YourAppId>">{children}</LenslyAnalytics>;
}
```
