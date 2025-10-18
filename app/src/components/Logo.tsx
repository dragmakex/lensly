"use client";

import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 64 }: LogoProps) {
  const aspectRatio = 365 / 1024;
  const height = Math.max(1, Math.round(size * aspectRatio));

  return (
    <Image
      src="/logo.svg"
      width={size}
      height={height}
      className={className}
      alt="Lensly Logo"
      priority
    />
  );
}
