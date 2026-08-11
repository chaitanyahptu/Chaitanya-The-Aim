import React from "react";
import { useEffect, useRef, useState } from "react";
export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [showReady, setShowReady] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);
 
  const DURATION = 3000;
 
  const READY_HOLD = 700;
 
  useEffect(() => {
   
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
 
    const tick = (timestamp) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const t = Math.min(elapsed / DURATION, 1); // never exceeds 1
      const eased = easeOutQuart(t);
      const next = Math.round(eased * 100);
 
      // Guard: only move forward, never backwards.
      setProgress((prev) => (next > prev ? next : prev));
 
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setShowReady(true);
      }
    };
 
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
 
  useEffect(() => {
    if (!showReady) return;
    const timeout = setTimeout(() => {
      onComplete?.();
    }, READY_HOLD);
    return () => clearTimeout(timeout);
  }, [showReady, onComplete]);
 
  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-end sm:mb-10"
      role="status"
      aria-live="polite"
      aria-busy={progress < 100}
    >
      <div className="flex w-full max-w-xs flex-col items-center gap-8 px-6 sm:max-w-sm">
        {/* Percentage */}
        <div className="font-mono text-sm tracking-[0.35em] text-white/90 tabular-nums sm:text-base">
          {String(progress).padStart(1, "0")}%
        </div>
 
        {/* Progress bar */}
        <div className="h-px w-full bg-white/15">
          <div
            className="h-px bg-white transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          className={`h-4 font-mono text-[10px] tracking-[0.5em] text-white/50 transition-opacity duration-500 sm:text-xs ${
            showReady ? "opacity-100" : "opacity-0"
          }`}
        >
          READY
        </div>
      </div>
    </div>
  );
}
 