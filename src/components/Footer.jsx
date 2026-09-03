// Footer.jsx — the dark full stop at the bottom of a light page.
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowUp, MapPin, Phone, Mail } from "lucide-react";
import { Reveal } from "./Motion";
import { CATEGORY_META } from "../data";
import { PHONES, EMAIL, ADDRESS, HOURS, WHATSAPP_LINK } from "../contactInfo";
import logo from "../assets/joyce-interiors.svg";

const shopLink = (category) =>
  `/products?category=${encodeURIComponent(category)}`;

const company = [
  { label: "About us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "All pieces", to: "/products" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 bg-ink text-cloud">
      <div className="mx-auto max-w-[var(--shell)] px-5 py-16 sm:px-8 md:py-20">
        {/* Visit band */}
        <Reveal variant="up">
          <div className="flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-14 md:flex-row md:items-end">
            <div>
              <span className="eyebrow text-brand-300">The showroom</span>
              <p className="display mt-5 text-[clamp(1.9rem,4.4vw,3.1rem)] text-cloud">
                come and <span className="italic-accent">lie down</span> on it.
              </p>
              <p className="mt-5 max-w-md text-sm leading-[1.85] text-cloud/55">
                Every mattress on this site is on the floor in Magodo. Open
                {" "}
                {HOURS}.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                WhatsApp us
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <Link
                to="/products"
                className="btn border border-white/20 bg-white/5 text-cloud transition-colors hover:border-brand-400 hover:text-brand-300"
              >
                Browse the shop
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Columns */}
        <div className="grid gap-12 pt-14 md:grid-cols-12">
          <Reveal variant="up" className="md:col-span-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt=""
                className="h-10 w-auto brightness-0 invert"
              />
              <span className="flex flex-col gap-[3px]">
                <span className="display text-xl leading-none text-cloud">Joyce</span>
                <span className="text-[8px] font-semibold uppercase leading-none tracking-[0.32em] text-cloud/45">
                  Interiors
                </span>
              </span>
            </div>
            <p className="mt-6 max-w-xs text-sm leading-[1.85] text-cloud/50">
              Mattresses, bedding, curtains, rugs and lighting — stocked in
              Lagos, fitted by our own team, guaranteed for two years.
            </p>

            <div className="mt-7 space-y-3">
              {PHONES.map((p) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  className="flex items-center gap-3 text-[13px] font-semibold text-brand-300 transition-colors hover:text-brand-200"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {p.display}
                </a>
              ))}
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 text-[13px] text-cloud/50 transition-colors hover:text-cloud"
              >
                <Mail className="h-3.5 w-3.5" />
                {EMAIL}
              </a>
              <p className="flex items-start gap-3 text-[13px] leading-relaxed text-cloud/50">
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  {ADDRESS.street}
                  <br />
                  {ADDRESS.area}
                </span>
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
                    className="block border-b border-white/8 py-2.5 text-[13px] text-cloud/55 transition-colors duration-300 hover:text-brand-300"
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
                    className="block border-b border-white/8 py-2.5 text-[13px] text-cloud/55 transition-colors duration-300 hover:text-brand-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-9 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cloud/55 transition-colors duration-500 hover:border-brand-400 hover:text-brand-300"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 sm:flex-row">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cloud/35">
            © {new Date().getFullYear()} Joyce Interiors
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cloud/35">
            Interior &amp; bedding — Lagos, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
