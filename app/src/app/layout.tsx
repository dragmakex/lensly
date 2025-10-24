import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import ClientProviders from "@/components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lensly.seraphim.zone"),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    interactiveWidget: 'resizes-visual'
  },
  title: {
    default: "Lensly",
    template: "%s | LENSLY",
  },
  description:
    "LENSLY provides powerful analytics solutions tailored for Farcaster MiniApps, enabling developers to gain insights and optimize user engagement.",
  keywords: [
    "base",
    "blockchain",
    "farcaster",
    "miniapps",
    "agentic",
    "ai",
    "layer 2",
    "l2",
    "evm",
    "coinbase",
    "crypto",
    "cryptocurrency",
    "blockchain",
    "analytics",
  ],
  authors: [{ name: "Lensly Team", url: "https://lensly.seraphim.zone" }],
  creator: "Lensly",
  publisher: "Lensly",
  applicationName: "Lensly Analytics Platform",
  category: "Analytics Application",
  classification: "Analytics Platform",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lensly.seraphim.zone",
    title: "LENSLY | ANALYTICS FOR MINIAPPS",
    description:
      "LENSLY provides powerful analytics solutions tailored for Farcaster MiniApps, enabling developers to gain insights and optimize user engagement.",
    siteName: "Lensly",
  },
  alternates: {
    canonical: "https://lensly.seraphim.zone",
  },
  other: {
    "fc:miniapp": JSON.stringify({
      "version": "next",
      "imageUrl": "https://lensly.seraphim.zone/og-image.png",
      "button": {
        "title": "View user and miniapp analytics",
        "action": {
          "type": "launch_frame",
          "name": "LENSLY",
          "url": "https://lensly.seraphim.zone",
          "splashImageUrl": "https://lensly.seraphim.zone/logo.png",
          "splashBackgroundColor": "#000000"
        }
      }
    })
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
