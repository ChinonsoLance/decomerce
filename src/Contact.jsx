// Contact.jsx — working email (mailto) plus phone / WhatsApp routes.
import { useState } from "react";
import { Phone, MessageCircle, Clock, ArrowRight, Check } from "lucide-react";
import { Reveal, SplitHeading, Parallax } from "./components/Motion";
import { ROOMS } from "./data";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    room: "Bedroom",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Your contact details
  const phoneNumber = "+234 704 753 5828";
  const whatsappLink = "https://wa.me/2347047535828"; // digits only for WhatsApp

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, room, message } = form;
    const subject = `${room} enquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nRoom: ${room}\n\n${message}`;
    // Opens the visitor's default email client (Gmail, Outlook, etc.)
    window.location.href = `mailto:hello@decomerce.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", room: "Bedroom", message: "" });
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const fieldClass =
    "w-full rounded-xl border border-line bg-cloud px-4 py-3 text-sm text-ink outline-none transition-colors duration-300 placeholder:text-haze focus:border-brand-400 focus:bg-canvas";

  const channels = [
    {
      icon: Phone,
      label: "Call",
      value: phoneNumber,
      note: "Speak to someone who has seen the piece in person.",
      href: `tel:${phoneNumber.replace(/\s/g, "")}`,
      external: false,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: phoneNumber,
      note: "Send a photo of the room — quickest way to get an answer.",
      href: whatsappLink,
      external: true,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ---------- Opening ---------- */}
      <section className="mx-auto max-w-[var(--shell)] px-5 pb-14 pt-16 sm:px-8 md:pb-20 md:pt-24">
        <Reveal variant="fade">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-brand-400" />
            <span className="eyebrow">Get in touch</span>
          </div>
        </Reveal>

        <SplitHeading
          as="h1"
          text={"let's talk about\nthe room."}
          accent="room."
          className="display mt-8 text-[clamp(2.8rem,8vw,5.6rem)]"
          stagger={80}
        />

        <Reveal variant="up" delay={200}>
          <p className="lead mt-9 max-w-xl">
            Send the room, the window drop and roughly what you want it to feel
            like. We come back with options, a delivery date and a total —
            usually the same working day.
          </p>
        </Reveal>
      </section>

      {/* ---------- Channels + form ---------- */}
      <section className="mx-auto max-w-[var(--shell)] px-5 pb-24 sm:px-8 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Channels */}
          <div className="lg:col-span-5">
            <div className="grid gap-3">
              {channels.map((c, i) => (
                <Reveal key={c.label} variant="up" delay={i * 110}>
                  <a
                    href={c.href}
                    {...(c.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="panel group flex items-start gap-5 p-7 transition-transform duration-500 hover:-translate-y-1.5 md:p-9"
                  >
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 transition-colors duration-500 group-hover:bg-brand-100">
                      <c.icon className="h-4 w-4 text-brand-600" />
                    </span>
                    <div>
                      <p className="label">{c.label}</p>
                      <p className="display-md mt-2.5 text-xl md:text-2xl">
                        {c.value}
                      </p>
                      <p className="mt-2.5 text-[13px] leading-relaxed text-stone">
                        {c.note}
                      </p>
                    </div>
                  </a>
                </Reveal>
              ))}

              <Reveal variant="up" delay={220}>
                <div className="panel flex items-start gap-5 p-7 md:p-9">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-50">
                    <Clock className="h-4 w-4 text-brand-600" />
                  </span>
                  <div>
                    <p className="label">Showroom</p>
                    <p className="mt-2.5 text-sm font-semibold text-ink">
                      Monday – Saturday, 9am – 7pm WAT
                    </p>
                    <p className="mt-2 text-[13px] text-haze">
                      Lekki Phase 1, Lagos. Walk in, no appointment needed.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal variant="curtain" delay={300} className="mt-8 hidden lg:block">
              <Parallax speed={-0.03}>
                <div className="arch-flat bg-sand shadow-[var(--shadow-lift)]">
                  <img
                    src={ROOMS[1].img}
                    alt=""
                    className="h-72 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Parallax>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal variant="up" delay={140} className="lg:col-span-7">
            <div className="panel p-8 md:p-12">
              <span className="eyebrow">Send a message</span>
              <h2 className="display mt-5 text-[clamp(1.9rem,3.6vw,2.8rem)]">
                start an <span className="italic-accent">enquiry</span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-stone">
                Submitting opens your email app with the details filled in —
                just press send.
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="label mb-2 block">
                      Full name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      className={fieldClass}
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="label mb-2 block">
                      Email address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      className={fieldClass}
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="room" className="label mb-2 block">
                    Which room?
                  </label>
                  <select
                    id="room"
                    name="room"
                    className={fieldClass}
                    value={form.room}
                    onChange={handleChange}
                  >
                    {[
                      "Bedroom",
                      "Living room",
                      "Guest room",
                      "Children's room",
                      "Whole apartment",
                      "Other",
                    ].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="label mb-2 block">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className={`${fieldClass} resize-none`}
                    placeholder="Bed size, window drop, colours you like, and when you need it."
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  Send message
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                {submitted && (
                  <p className="flex items-center justify-center gap-2.5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3.5 text-sm font-semibold text-brand-700">
                    <Check className="h-4 w-4" />
                    Email client opened — please review and press send.
                  </p>
                )}
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
