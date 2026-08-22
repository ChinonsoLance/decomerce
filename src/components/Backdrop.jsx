// Backdrop.jsx — the single fixed atmosphere layer shared by every page.
// It never unmounts on route change, so the room reads as one continuous
// space from the top of the masthead to the bottom of the footer.
//
// The whole scene is four static layers plus one lamp. There is no canvas and
// no animation loop: the lamp is a single CSS custom property written at most
// a few times a second, and everything else is painted once.

import { useEffect, useRef } from "react";
import { useScrollTick, prefersReducedMotion } from "../hooks/useScroll";

export default function Backdrop() {
  const rootRef = useRef(null);
  const lampRef = useRef(null);
  const lastDepth = useRef(-1);

  // Publish scroll depth (0 → 1) so the floor wash deepens down the page.
  //
  // The variable goes on this element rather than <html>: a custom property on
  // the root invalidates style for every node that could inherit it — the
  // whole tree — on every frame. Only the layers below actually read it.
  useScrollTick((m) => {
    const el = rootRef.current;
    if (!el) return;
    const depth = Math.round(m.depth * 100) / 100;
    if (depth === lastDepth.current) return;
    lastDepth.current = depth;
    el.style.setProperty("--page-depth", depth);
  });

  // The lamp follows the pointer on desktop. Coarse pointers and reduced
  // motion leave it parked, which is also what the CSS defaults to.
  useEffect(() => {
    const lamp = lampRef.current;
    if (!lamp) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    let nextX = 50;
    let nextY = 30;

    const apply = () => {
      frame = 0;
      lamp.style.setProperty("--lamp-x", `${nextX}%`);
      lamp.style.setProperty("--lamp-y", `${nextY}%`);
    };

    const onMove = (e) => {
      nextX = Math.round((e.clientX / window.innerWidth) * 100);
      nextY = Math.round((e.clientY / window.innerHeight) * 100);
      // One write per frame at most; the 1.4s CSS transition does the easing,
      // so there is nothing to gain from writing more often than this.
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className="site-backdrop" aria-hidden="true">
      <div ref={lampRef} className="backdrop-lamp" />
      <div className="backdrop-floor" />
      <div className="backdrop-columns" />
      <div className="backdrop-vignette" />
      <div className="backdrop-noise" />
    </div>
  );
}
