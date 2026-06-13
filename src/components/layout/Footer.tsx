import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { siteConfig } from "@content/site-config";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();

  const navLinks = [
    { key: "home", href: `/${locale}` },
    { key: "menu", href: `/${locale}/menu` },
    { key: "story", href: `/${locale}/story` },
    { key: "visit", href: `/${locale}/visit` },
    { key: "reserve", href: `/${locale}/reserve` },
    { key: "gallery", href: `/${locale}/gallery` },
  ] as const;

  return (
    <footer className="bg-[var(--color-earth-900)] text-[var(--color-earth-100)] mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="text-2xl font-bold text-[var(--color-terracotta-300)]">
              {locale === "bn" ? "কালাই ঘর" : "Kalai Ghor"}
            </p>
            <p className="mt-1 text-sm text-[var(--color-earth-200)]">{t("tagline")}</p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta-400)] mb-3">
              {t("quickLinks")}
            </p>
            <ul className="space-y-2">
              {navLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--color-earth-200)] hover:text-[var(--color-terracotta-300)] transition-colors"
                  >
                    {nav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta-400)] mb-3">
              {t("contact")}
            </p>
            <ul className="space-y-3 text-sm text-[var(--color-earth-200)]">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[var(--color-terracotta-400)]" />
                <span>
                  {siteConfig.address.area}, {siteConfig.address.city}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-2 hover:text-[var(--color-terracotta-300)] transition-colors"
                >
                  <Phone size={15} className="text-[var(--color-terracotta-400)]" />
                  {siteConfig.phone === "TODO_PHONE_NUMBER" ? "TODO: Phone" : siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--color-terracotta-300)] transition-colors"
                >
                  <MessageCircle size={15} className="text-[var(--color-terracotta-400)]" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-earth-800)] text-xs text-[var(--color-earth-200)] text-center">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
