"use client";

export default function Logo({ className = "", size = 64 }) {
  return (
    <img
      src="/logo.svg"
      width={size}
      height={size * 2.8}
      className={className}
      alt="Farcaster Analytics Logo"
    />
  );
}