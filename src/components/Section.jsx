// Section.jsx — the editorial section header used everywhere on the site:
// an index number, a rule that draws itself across the row, a mono label, and
// a lowercase serif title beneath. It is the piece of furniture that makes the
// whole site read as one printed catalogue.

import { Reveal, SplitHeading } from "./Motion";
import { useRevealRef } from "../hooks/useScroll";

export function SectionHead({
  index,
  label,
  title,
  aside,
  as = "h2",
  className = "",
  titleClass = "text-[clamp(2.2rem,5.6vw,4.2rem)]",
}) {
  const ruleRef = useRevealRef(true);

  return (
    <div className={className}>
      {/* The index row: number — rule — label, all on one baseline. */}
      <div className="flex items-center gap-5">
        <Reveal variant="fade">
          <span className="num text-[11px] font-bold tracking-[0.28em] text-brand-500">
            {index}
          </span>
        </Reveal>
        <div ref={ruleRef} className="rule-draw hairline flex-1" />
        <Reveal variant="fade" delay={120}>
          <span className="label whitespace-nowrap">{label}</span>
        </Reveal>
      </div>

      <div className="mt-9 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-16">
        <SplitHeading
          as={as}
          text={title}
          className={`display ${titleClass}`}
          stagger={70}
        />
        {aside && (
          <Reveal variant="up" delay={160} className="md:max-w-sm md:pb-3">
            <p className="text-sm leading-[1.85] text-stone">{aside}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}
