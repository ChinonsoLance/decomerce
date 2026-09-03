// contact.js — one source of truth for how to reach the shop.
//
// The phone number, the address and the opening hours were previously retyped
// in five separate files, which is exactly how a site ends up advertising a
// line that was disconnected two years ago. Change them here only.

/**
 * Nigerian numbers are quoted locally (0702 640 3258) but `tel:` and WhatsApp
 * both want E.164 digits, so derive those rather than storing three spellings
 * of the same number and letting them drift apart.
 */
function number(local) {
  const digits = local.replace(/\D/g, "");
  const intl = `234${digits.replace(/^0/, "")}`;
  return {
    local,
    display: `+234 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`,
    tel: `+${intl}`,
    wa: intl,
  };
}

// First entry is the primary line — the one on WhatsApp and in the nav.
export const PHONES = [number("0702 640 3258"), number("0818 734 5832")];
export const PHONE = PHONES[0];

export const WHATSAPP = PHONE.wa;
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP}`;

export const EMAIL = "hello@joyceinteriors.com";

export const ADDRESS = {
  street: "No. 59 Adekunle Banjo Avenue",
  area: "Magodo, Lagos",
  short: "Magodo, Lagos",
  full: "No. 59 Adekunle Banjo Avenue, Magodo, Lagos",
};

export const HOURS = "Monday – Saturday, 9am – 7pm";
export const HOURS_LONG = "Monday – Saturday, 9am – 7pm WAT";
