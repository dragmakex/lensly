interface LenslyAnalyticsProps {
    appId: string;
}

declare const LenslyAnalytics: ({ appId }: LenslyAnalyticsProps) => any;

export { LenslyAnalytics, type LenslyAnalyticsProps };
