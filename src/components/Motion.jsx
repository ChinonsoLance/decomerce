// Motion.jsx — presentational scroll-story primitives.
// All scroll plumbing lives in ../hooks/useScroll.

import { useEffect, useRef, useState } from "react";
import {
  prefersReducedMotion,
  useRevealRef,
  useScrollMeasure,
} from "../hooks/useScroll";

/**
 * Fades/slides its children in the first time they enter the viewport.
 * variant: up | down | left | right | scale | fade | curtain
 */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  duration,
  once = true,
  className = "",
  style,
  children,
  ...rest
}) {
  const ref = useRevealRef(once);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${className}`}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        transitionDuration: duration ? `${duration}ms` : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** A hairline rule that draws itself across when scrolled into view. */
export function DrawRule({ className = "", delay = 0 }) {
  const ref = useRevealRef(true);

  return (
    <div
      ref={ref}
      className={`rule-draw hairline ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    />
  );
}

/**
 * Headline whose words lift out of a mask, one after another.
 *
 * `accent` names a single word to set in the italic amber voice — the site
 * uses it for one word per headline, never for a whole line.
 */
export function SplitHeading({
  text,
  as: Tag = "h2",
  className = "",
  stagger = 65,
  delay = 0,
  accent,
}) {
  const ref = useRevealRef(true);
  const lines = String(text).split("\n");
  const accentKey = accent ? accent.toLowerCase() : null;

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <span key={li} className="block">
            {words.map((word, wi) => {
              // Punctuation is stripped so "hold" still matches "hold,".
              const bare = word.toLowerCase().replace(/[^a-z']/g, "");
              return (
                <span key={wi} className="word-wrap">
                  <span
                    className={`word ${
                      accentKey && bare === accentKey ? "italic-accent" : ""
                    }`}
                    style={{
                      transitionDelay: `${delay + (li * 4 + wi) * stagger}ms`,
                    }}
                  >
                    {word}
                  </span>
                  {wi < words.length - 1 && <span>&nbsp;</span>}
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}

/**
 * Drifts its children against the scroll direction.
 * speed: positive drifts down, negative drifts up. ~0.06–0.3 reads well.
 */
export function Parallax({ speed = 0.14, className = "", children, ...rest }) {
  const ref = useRef(null);
  const reduced = useRef(false);
  const last = useRef(null);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
  }, []);

  // Split-phase: measure in the read pass, write the transform in the write
  // pass. Measuring and mutating in the same pass forces the browser to redo
  // layout for the next Parallax on the page, every frame.
  useScrollMeasure(
    (m) => {
      const el = ref.current;
      if (!el || reduced.current) return null;
      const rect = el.getBoundingClientRect();
      // Off-screen by more than a viewport: nothing to move.
      if (rect.bottom < -m.viewportH || rect.top > m.viewportH * 2) return null;
      const centerOffset = rect.top + rect.height / 2 - m.viewportH / 2;
      return Math.round(centerOffset * speed * 100) / 100;
    },
    (offset) => {
      const el = ref.current;
      if (!el || offset === null || offset === last.current) return;
      last.current = offset;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
  );

  return (
    <div ref={ref} className={`parallax-layer ${className}`} {...rest}>
      {children}
    </div>
  );
}

/** Counts up to `value` the first time it scrolls into view. */
export function Counter({ value, duration = 1800, decimals = 0, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? value : 0));

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const started = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - started) / duration);
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
          setDisplay(value * eased);
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
