// useScroll.js — one shared, rAF-throttled scroll loop for the whole site.
// Every parallax layer, progress rail and scrubbed section reads from this,
// so there is exactly one scroll listener no matter how many consumers mount.
//
// Two things in here exist purely for performance, and both matter a lot:
//
//  1. Page metrics (scrollY, viewport height, max scroll) are measured ONCE per
//     frame and handed to every subscriber. Reading `documentElement.scrollHeight`
//     forces a synchronous layout of the entire document; it used to happen
//     twice per frame, on every frame of every scroll.
//
//  2. The frame is split into a read phase and a write phase. If one subscriber
//     measures an element and the next one writes a transform, the browser has
//     to re-run layout before the following measurement — "layout thrashing".
//     Measuring everything first, then mutating everything, costs one layout
//     per frame instead of one per subscriber.

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* ---------------- shared frame loop ---------------- */

const subscribers = new Set();
let ticking = false;

export const metrics = {
  scrollY: 0,
  viewportH: 0,
  maxScroll: 0,
  /** 0 → 1 through the whole document */
  depth: 0,
};

// scrollHeight is expensive to read, and only changes when content or the
// window does — so it is cached here and refreshed by the observers below.
let docHeight = 0;
let heightDirty = true;

function measureDocument() {
  docHeight = document.documentElement.scrollHeight;
  heightDirty = false;
}

function refreshMetrics() {
  if (heightDirty) measureDocument();
  metrics.scrollY = window.scrollY;
  metrics.viewportH = window.innerHeight;
  metrics.maxScroll = Math.max(docHeight - metrics.viewportH, 0);
  metrics.depth = metrics.maxScroll > 0 ? metrics.scrollY / metrics.maxScroll : 0;
}

function flush() {
  ticking = false;
  refreshMetrics();

  // Phase 1 — measure. Nothing in here is allowed to mutate the DOM.
  for (const s of subscribers) {
    s.value = s.read ? s.read(metrics) : undefined;
  }
  // Phase 2 — mutate. Nothing in here is allowed to read geometry back.
  for (const s of subscribers) {
    if (s.write) s.write(s.value, metrics);
  }
}

function schedule() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(flush);
}

/** Marks cached page height stale — call after anything that changes it. */
export function invalidateScrollMetrics() {
  heightDirty = true;
  schedule();
}

if (typeof window !== "undefined") {
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", invalidateScrollMetrics, { passive: true });

  // Content growing or shrinking (route change, filtered grid, image load)
  // changes the page height without a scroll or resize event.
  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(invalidateScrollMetrics);
    if (document.body) ro.observe(document.body);
    else
      document.addEventListener("DOMContentLoaded", () => ro.observe(document.body), {
        once: true,
      });
  }
}

/* ---------------- reduced motion ---------------- */

// matchMedia() allocates a MediaQueryList on every call; this used to run
// inside a render and inside per-frame code paths.
let motionQuery = null;
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  if (!motionQuery) motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  return motionQuery.matches;
}

/* ---------------- subscription hooks ---------------- */

function useFrameSubscription(read, write) {
  const readRef = useRef(read);
  const writeRef = useRef(write);

  useLayoutEffect(() => {
    readRef.current = read;
    writeRef.current = write;
  });

  useEffect(() => {
    const entry = {
      read: read ? (m) => readRef.current && readRef.current(m) : undefined,
      write: write ? (v, m) => writeRef.current && writeRef.current(v, m) : undefined,
    };
    subscribers.add(entry);
    // Prime after paint rather than during the effect body.
    invalidateScrollMetrics();
    return () => {
      subscribers.delete(entry);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Runs `callback(metrics)` once per animation frame while the page is
 * scrolling. Use this for consumers that only WRITE (a progress bar, a CSS
 * variable, a boolean flag) — anything that needs to measure an element first
 * should use `useScrollMeasure` so the read lands in the right phase.
 */
export function useScrollTick(callback) {
  // flush() invokes writers as (value, metrics). A plain tick has no read
  // phase, so `value` is always undefined -- drop it and hand the callback the
  // metrics directly, which is the signature every consumer expects.
  useFrameSubscription(null, (_value, m) => callback(m));
}

/**
 * Split-phase version: `read(metrics)` measures and returns a value, then
 * `write(value, metrics)` applies it. Keeps measurements and mutations from
 * interleaving across subscribers.
 */
export function useScrollMeasure(read, write) {
  useFrameSubscription(read, write);
}

/** Progress (0 → 1) of an element travelling through the viewport. */
export function useSectionProgress(ref) {
  const [progress, setProgress] = useState(0);
  const last = useRef(0);

  useScrollMeasure(
    (m) => {
      const el = ref.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const distance = Math.max(rect.height + m.viewportH, 1);
      return Math.min(1, Math.max(0, (m.viewportH - rect.top) / distance));
    },
    (value) => {
      if (value === null) return;
      // Only re-render React when the value actually moves a visible amount.
      if (Math.abs(value - last.current) < 0.002) return;
      last.current = value;
      setProgress(value);
    }
  );

  return progress;
}

/* ---------------- reveal-on-scroll ---------------- */

let observer = null;
let armObserver = null;
const registry = new WeakMap();

/**
 * Fires well before the reveal does, and hands the element a compositor layer
 * only for the short window where it is actually about to animate.
 */
function getArmObserver() {
  if (armObserver) return armObserver;
  armObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("is-armed", entry.isIntersecting);
        if (entry.target.classList.contains("is-in")) {
          armObserver.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "50% 0px 50% 0px" }
  );
  return armObserver;
}

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const opts = registry.get(entry.target);
        if (!opts) continue;
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          if (opts.once) observer.unobserve(entry.target);
        } else if (!opts.once) {
          entry.target.classList.remove("is-in");
        }
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );
  return observer;
}

/**
 * Returns a ref. The element it is attached to gains the `is-in` class the
 * first time it scrolls into view (immediately, if motion is reduced).
 */
export function useRevealRef(once = true) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.classList.add("is-in");
      return;
    }

    registry.set(el, { once });
    const io = getObserver();
    const arm = getArmObserver();
    io.observe(el);
    arm.observe(el);
    return () => {
      io.unobserve(el);
      arm.unobserve(el);
    };
  }, [once]);

  return ref;
}
