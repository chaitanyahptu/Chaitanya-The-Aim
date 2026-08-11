import React from "react";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

export default function PageTransition({ active, onComplete }) {
  const containerRef = useRef(null);
  const barRef = useRef(null);
  const streakRefs = useRef([]);
  const flashRef = useRef(null);
  const timelineRef = useRef(null);

  const streakAngles = useMemo(
    () => Array.from({ length: 24 }, (_, i) => (360 / 24) * i),
    []
  );

  useEffect(() => {
    if (!active) return;

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(containerRef.current, {
        autoAlpha: 1,
      });

      gsap.set(flashRef.current, {
        opacity: 0,
      });

      gsap.set(barRef.current, {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
      });

      gsap.set(streakRefs.current, {
        scaleY: 0,
        opacity: 0,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        },
      });

      timelineRef.current = tl;

      /*
        ========================================
        1. SLIGHT WHITE FLASH
        ========================================
      */

      tl.to(flashRef.current, {
        opacity: 0.85,
        duration: 0.08,
        ease: "power2.out",
      });

      tl.to(flashRef.current, {
        opacity: 0,
        duration: 0.16,
        ease: "power2.in",
      });

      /*
        ========================================
        2. BAR SHOOTS FORWARD
        ========================================
      */

      tl.to(
        barRef.current,
        {
          scaleX: 18,
          scaleY: 0.4,
          opacity: 0,
          duration: 0.9,
          ease: "power4.in",
        },
        "<"
      );

      /*
        ========================================
        3. RADIAL STREAKS START
        ========================================
      */

      tl.to(
        streakRefs.current,
        {
          scaleY: 1,
          opacity: 0.85,
          duration: 0.8,
          ease: "power3.in",
          stagger: {
            each: 0.012,
            from: "random",
          },
        },
        "<0.05"
      );

      /*
        ========================================
        4. STREAKS DISAPPEAR
        ========================================
      */

      tl.to(
        streakRefs.current,
        {
          opacity: 0,
          duration: 0.25,
          ease: "power1.in",
        },
        "-=0.2"
      );

      /*
        ========================================
        5. REMOVE TRANSITION
        ========================================
      */

      tl.to(containerRef.current, {
        autoAlpha: 0,
        duration: 0.25,
        ease: "power1.out",
      });

    }, containerRef);

    return () => {
      timelineRef.current?.kill();
      ctx.revert();
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-black"
      aria-hidden="true"
    >
      {/* Radial streaks */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {streakAngles.map((angle, i) => (
          <div
            key={angle}
            ref={(el) => {
              streakRefs.current[i] = el;
            }}
            className="absolute top-1/2 left-1/2 h-[42vh] w-px origin-top bg-white/70"
            style={{
              transform: `translate(-50%, 0) rotate(${angle}deg) scaleY(0)`,
            }}
          />
        ))}
      </div>

      {/* Loader progress bar continuation */}
      <div
        ref={barRef}
        className="relative h-px w-40 bg-white sm:w-48"
      />

      {/* White flash */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 bg-white opacity-0"
      />
    </div>
  );
}
