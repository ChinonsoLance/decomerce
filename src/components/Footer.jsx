// Footer.jsx — transparent so the room's gradient runs through it.
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowUp, MapPin, Phone } from "lucide-react";
import { Reveal } from "./Motion";
import { CATEGORY_META } from "../data";
import logo from "../assets/decomerce.svg";

const shopLink = (category) =>
  `/products?category=${encodeURIComponent(category)}`;

const company = [
  { label: "About us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "All pieces", to: "/products" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10">
      {/* Visit band */}
      <div className="mx-auto max-w-[var(--shell)] px-5 py-16 sm:px-8 md:py-20">
        <Reveal variant="up">
          <div className="flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-16 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">The showroom</span>
              <p className="display mt-5 text-[clamp(1.9rem,4.4vw,3.2rem)] text-white">
                come and <span className="italic-accent">lie down</span> on it.
              </p>
              <p className="mt-5 max-w-md text-sm leading-[1.85] text-mist/50">
                Every mattress on this site is on the floor in Lekki. Open
                Monday to Saturday, 9am – 7pm.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/2347047535828"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                WhatsApp us
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <Link to="/contact" className="btn btn-outline">
                Book a styling visit
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Columns */}
        <div className="grid gap-12 pt-16 md:grid-cols-12">
          <Reveal variant="up" className="md:col-span-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="" className="h-10 w-auto" />
              <span className="display text-xl text-white">
                deco<span className="italic-accent">merce</span>
              </span>
            </div>
            <p className="mt-6 max-w-xs text-sm leading-[1.85] text-mist/45">
              Mattresses, bedding, curtains, rugs and lighting — stocked in
              Lagos, fitted by our own team, guaranteed for two years.
            </p>

            <div className="mt-7 space-y-2.5">
              <a
                href="tel:+2347047535828"
                className="flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-ember-300"
              >
                <Phone className="h-3.5 w-3.5" />
                +234 704 753 5828
              </a>
              <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-mist/45">
                <MapPin className="h-3.5 w-3.5" />
                Lekki Phase 1, Lagos
              </p>
            </div>
          </Reveal>

          <Reveal variant="up" delay={120} className="md:col-span-5">
            <p className="label">Collections</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6">
              {CATEGORY_META.map((c) => (
                <li key={c.name}>
                  <Link
                    to={shopLink(c.name)}
                    className="block border-b border-white/6 py-2.5 text-[13px] text-mist/55 transition-colors duration-300 hover:text-ember-300"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="up" delay={220} className="md:col-span-3">
            <p className="label">Company</p>
            <ul className="mt-6">
              {company.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="block border-b border-white/6 py-2.5 text-[13px] text-mist/55 transition-colors duration-300 hover:text-ember-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-9 flex h-11 w-11 items-center justify-center border border-white/12 text-mist/55 transition-colors duration-500 hover:border-ember-400/60 hover:text-ember-300"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 sm:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist/30">
            © {new Date().getFullYear()} Decomerce
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist/30">
            Interior &amp; bedding — Lagos, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
