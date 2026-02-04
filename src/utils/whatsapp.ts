import { CONTACT } from "../config/contact";

// src/utils/whatsapp.ts
export function openWhatsApp(message?: string) {
  // const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const number = CONTACT.phone;

  const url = message
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${number}`;

  window.open(url, "_blank", "noopener,noreferrer");
}