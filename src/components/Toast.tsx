"use client";

import { useEffect } from "react";

/** Centered bottom toast (~3.8s). Render conditionally on a truthy message. */
export function Toast({
  message,
  onDismiss,
  duration = 3800,
}: {
  message: string;
  onDismiss: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-7 left-1/2 z-[200] -translate-x-1/2 bg-primary text-gold-light px-[26px] py-4 rounded-[12px] shadow-toast font-semibold text-[15px] border border-gold/30 flex items-center gap-3"
      style={{ animation: "toast-in 0.25s ease-out" }}
    >
      <span className="text-gold">✓</span>
      {message}
    </div>
  );
}
