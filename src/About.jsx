// About.jsx — the story chapter of the catalogue.
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal, SplitHeading, Parallax, Counter } from "./components/Motion";
import { SectionHead } from "./components/Section";
import { PRODUCTS, ROOMS, STATS } from "./data";

const values = [
  {
    index: "01",
    title: "Comfort you can test",
    description:
      "Every mattress on this site is on the showroom floor in Magodo. Lie on it for as long as you like before you commit to it.",
  },
  {
    index: "02",
    title: "Made for the climate",
    description:
      "Tog ratings, weaves and fills are chosen for harmattan and humidity — not copied out of a European catalogue.",
  },
  {
    index: "03",
    title: "Fitted, not dropped off",
    description:
      "Curtains are hung, rugs are laid, mattresses are carried up. The packaging leaves with the delivery team.",
  },
  {
    index: "04",
    title: "One room at a time",
    description:
      "We would rather finish a single room properly than sell you a house full of things that do not speak to each other.",
  },
];

const milestones = [
  { year: "2017", event: "Opened as a single bedding stall in Magodo, selling sheets and pillows." },
  { year: "2019", event: "First mattress lines added, along with our own delivery van." },
  { year: "2021", event: "Made-to-measure curtain workshop opened, with on-site measuring." },
  { year: "2023", event: "Rugs, lighting and wall decor brought the shop up to eight collections." },
  { year: "2026", event: "Forty pieces in stock, delivered nationwide and styled on request." },
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* ---------- Opening ---------- */}
      <section className="mx-auto max-w-[var(--shell)] px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
        <Reveal variant="fade">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-brand-400" />
            <span className="eyebrow">Our story</span>
          </div>
        </Reveal>

        <SplitHeading
          as="h1"
          text={"a shop built\naround sleep."}
          accent="sleep."
          className="display mt-8 max-w-4xl text-[clamp(2.8rem,8vw,5.6rem)]"
          stagger={80}
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal variant="up" delay={180} className="lg:col-span-7">
            <p className="text-base leading-[1.95] text-stone">
              Joyce Interiors started with selling curtains, and grew
              outward the way a room does — first the bed, then the windows,
              then the floor, then the light. We still think in that order. Buy
              the mattress properly and everything after it is decoration; get
              it wrong and nothing else in the room rescues it.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="panel px-4 py-7 text-center">
                  <p className="display num text-3xl text-shimmer">
                    <Counter
                      value={s.value}
                      decimals={s.decimals || 0}
                      suffix={s.suffix}
                    />
                  </p>
                  <p className="label mt-2.5">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal variant="curtain" delay={280} className="lg:col-span-5">
            <Parallax speed={-0.04}>
              <div className="arch bg-sand shadow-[var(--shadow-lift)]">
                <img
                  src={ROOMS[0].img}
                  alt=""
                  className="h-[420px] w-full object-cover md:h-[540px]"
                />
              </div>
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* ---------- Mission ---------- */}
      <section className="border-y border-line bg-sand/50">
        <div className="mx-auto max-w-[var(--shell)] px-5 py-20 sm:px-8 md:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <span className="eyebrow">Our mission</span>
              <SplitHeading
                text={"make a good room\nreachable without\na decorator."}
                accent="reachable"
                className="display mt-7 text-[clamp(1.9rem,4vw,3rem)]"
                stagger={55}
              />
            </div>
            <Reveal variant="up" delay={200} className="lg:col-span-7 lg:pt-16">
              <p className="max-w-2xl text-[15px] leading-[1.95] text-stone">
                Most people do not need a design studio. They need honest
                sizing, materials that survive Lagos, a delivery that turns up,
                and someone who will say plainly that the rug is too small. That
                is the whole business — and it is why the shop is forty pieces
                deep rather than four hundred.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Values ---------- */}
      <section className="mx-auto max-w-[var(--shell)] px-5 py-20 sm:px-8 md:py-28">
        <SectionHead
          index="01"
          label="What we hold to"
          title={"four principles."}
          titleClass="text-[clamp(2.1rem,5vw,3.6rem)]"
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {values.map((v, i) => (
            <Reveal
              key={v.title}
              variant="up"
              delay={(i % 2) * 100}
              className="panel p-8 transition-transform duration-500 hover:-translate-y-1.5 md:p-11"
            >
              <span className="num text-[10px] font-bold tracking-[0.28em] text-brand-500">
                {v.index}
              </span>
              <h3 className="display-md mt-5 text-2xl">{v.title}</h3>
              <p className="mt-4 text-sm leading-[1.85] text-stone">
                {v.description}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Timeline ---------- */}
      {/* <section className="border-t border-line">
        <div className="mx-auto max-w-[var(--shell)] px-5 py-20 sm:px-8 md:py-28">
          <SectionHead
            index="02"
            label="The timeline"
            title={"how we got\nhere."}
            titleClass="text-[clamp(2.1rem,5vw,3.6rem)]"
          />

          <div className="mt-16">
            {milestones.map((m, i) => (
              <Reveal
                key={m.year}
                variant="up"
                delay={i * 70}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-line py-7 last:border-b sm:grid-cols-[120px_1fr] sm:gap-10"
              >
                <span className="num text-sm font-bold tracking-[0.1em] text-brand-600">
                  {m.year}
                </span>
                <p className="text-[15px] leading-[1.85] text-stone transition-colors duration-500 group-hover:text-ink">
                  {m.event}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section> */}

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-[var(--shell)] px-5 py-24 sm:px-8 md:py-32">
        <div className="panel-brand p-10 text-center md:p-20">
          <SplitHeading
            text={"ready when\nyou are."}
            accent="ready"
            className="display text-[clamp(2.2rem,6vw,4.2rem)]"
          />
          <Reveal variant="up" delay={200}>
            <p className="lead mx-auto mt-8 max-w-md">
              Browse the shop, or tell us about the room and let us come back
              with a scheme.
            </p>
          </Reveal>
          <Reveal variant="up" delay={300}>
            <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
              <Link to="/products" className="btn btn-primary">
                Shop {PRODUCTS.length} pieces
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Contact us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
