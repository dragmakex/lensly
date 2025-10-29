"use client";

import ClientProviders from "@/components/ClientProviders";

export default function WithProvidersLayout({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}