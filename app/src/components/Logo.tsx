"use client";

export default function Logo({ className = "", size = 64 }) {
  return (
    <img
      src="/logo.svg"
      width={size}
      height={size}
      className={className}
      alt="Lensly Logo"
      style={{ aspectRatio: '365/1024' }}
    />
  );
}
