import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, WHATSAPP_HREF } from "../data/services.js";
import { FacebookIcon, InstagramIcon, TiktokIcon, WhatsappIcon, YoutubeIcon } from "./icons/SocialIcons.jsx";

const SOCIAL_LINKS = [
  { label: "WhatsApp", href: WHATSAPP_HREF, icon: WhatsappIcon },
  { label: "E-Mail", href: `mailto:${CONTACT_EMAIL}`, icon: Mail },
  // Placeholders until the real social profiles are ready — kept in one
  // place so swapping them later is a one-line change per entry.
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "TikTok", href: "#", icon: TiktokIcon },
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "YouTube", href: "#", icon: YoutubeIcon },
];

const LEGAL_LINKS = [
  { label: "Impressum", to: "/impressum" },
  { label: "Datenschutz", to: "/datenschutz" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg px-6 py-14 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div>
            <span className="font-display text-lg font-semibold text-ink">
              BROSKI<span className="text-accent">.</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">
              Fahrzeugaufbereitung — mobil bei dir in Wuppertal &amp; Umgebung.
            </p>

            <div className="mt-6 flex flex-col gap-2 text-sm text-ink-soft">
              <a href={CONTACT_PHONE_HREF} className="w-fit transition-colors duration-150 hover:text-ink">
                {CONTACT_PHONE}
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="w-fit transition-colors duration-150 hover:text-ink">
                {CONTACT_EMAIL}
              </a>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noreferrer"
                className="w-fit transition-colors duration-150 hover:text-ink"
              >
                WhatsApp: {CONTACT_PHONE}
              </a>
            </div>
          </div>

          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-150 hover:border-ink hover:text-ink"
              >
                <Icon size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Broski Detailing — Platzhalter</span>
          <div className="flex gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="transition-colors duration-150 hover:text-ink">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
