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
    "w-full border-b border-white/12 bg-transparent py-3 text-sm text-white placeholder-mist/25 outline-none transition-colors duration-500 focus:border-ember-400";

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
            <span className="h-px w-10 bg-ember-400/70" />
            <span className="eyebrow">Get in touch</span>
          </div>
        </Reveal>

        <SplitHeading
          as="h1"
          text={"let's talk about\nthe room."}
          accent="room."
          className="display mt-8 text-[clamp(2.8rem,8vw,6rem)] text-white"
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
            <div className="grid gap-px bg-white/8">
              {channels.map((c, i) => (
                <Reveal key={c.label} variant="up" delay={i * 110}>
                  <a
                    href={c.href}
                    {...(c.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group flex items-start gap-5 bg-ink p-7 transition-colors duration-500 hover:bg-ash-950 md:p-9"
                  >
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-white/12 transition-colors duration-500 group-hover:border-ember-400/60">
                      <c.icon className="h-4 w-4 text-ember-400" />
                    </span>
                    <div>
                      <p className="label">{c.label}</p>
                      <p className="display-md mt-2.5 text-xl text-white md:text-2xl">
                        {c.value}
                      </p>
                      <p className="mt-2.5 text-[13px] leading-relaxed text-mist/50">
                        {c.note}
                      </p>
                    </div>
                  </a>
                </Reveal>
              ))}

              <Reveal variant="up" delay={220}>
                <div className="flex items-start gap-5 bg-ink p-7 md:p-9">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-white/12">
                    <Clock className="h-4 w-4 text-ember-400" />
                  </span>
                  <div>
                    <p className="label">Showroom</p>
                    <p className="mt-2.5 text-sm text-white/90">
                      Monday – Saturday, 9am – 7pm WAT
                    </p>
                    <p className="mt-2 text-[13px] text-mist/45">
                      Lekki Phase 1, Lagos. Walk in, no appointment needed.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal variant="curtain" delay={300} className="mt-8 hidden lg:block">
              <Parallax speed={-0.03}>
                <div className="arch-flat border border-white/10">
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
            <div className="panel-ember p-8 md:p-12">
              <span className="eyebrow">Send a message</span>
              <h2 className="display mt-5 text-[clamp(1.9rem,3.6vw,2.8rem)] text-white">
                start an <span className="italic-accent">enquiry</span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-mist/50">
                Submitting opens your email app with the details filled in —
                just press send.
              </p>

              <form onSubmit={handleSubmit} className="mt-11 space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="label mb-1 block">
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
                    <label htmlFor="email" className="label mb-1 block">
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
                  <label htmlFor="room" className="label mb-1 block">
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
                      <option key={r} value={r} className="bg-ash-900">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="label mb-1 block">
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
                  <p className="flex items-center justify-center gap-2.5 border border-ember-400/30 bg-ember-500/10 px-4 py-3.5 text-sm text-ember-300">
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
