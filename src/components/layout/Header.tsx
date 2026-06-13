"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

type Props = { locale: string };

const navKeys = ["home", "menu", "story", "visit", "reserve", "gallery"] as const;

const navHrefs: Record<string, string> = {
  home: "/",
  menu: "/menu",
  story: "/story",
  visit: "/visit",
  reserve: "/reserve",
  gallery: "/gallery",
};

export default function Header({ locale }: Props) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const otherLocale = locale === "bn" ? "en" : "bn";
  // Build the same path in the other locale
  const pathWithoutLocale = pathname.replace(/^\/(bn|en)/, "") || "/";
  const switchHref = `/${otherLocale}${pathWithoutLocale}`;

  const isActive = (key: string) => {
    const href = `/${locale}${navHrefs[key] === "/" ? "" : navHrefs[key]}`;
    return pathname === href || (navHrefs[key] !== "/" && pathname.startsWith(href));
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-cream)]/95 backdrop-blur-sm border-b border-[var(--color-earth-100)] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex flex-col leading-tight"
            aria-label={locale === "bn" ? "কালাই ঘর — হোমপেজ" : "Kalai Ghor — Homepage"}
          >
            <span className="text-xl font-bold text-[var(--color-terracotta-600)] tracking-tight">
              {locale === "bn" ? "কালাই ঘর" : "Kalai Ghor"}
            </span>
            <span className="text-[10px] text-[var(--color-earth-800)] uppercase tracking-widest">
              {locale === "bn" ? "রাজশাহী" : "Rajshahi"}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navKeys.map((key) => (
              <Link
                key={key}
                href={`/${locale}${navHrefs[key] === "/" ? "" : navHrefs[key]}`}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(key)
                    ? "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)]"
                    : "text-[var(--color-earth-800)] hover:bg-[var(--color-terracotta-50)] hover:text-[var(--color-terracotta-600)]"
                }`}
              >
                {t(key)}
              </Link>
            ))}
            {/* Language switcher */}
            <Link
              href={switchHref}
              aria-label={locale === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
              className="ml-2 px-3 py-1.5 rounded-full border border-[var(--color-terracotta-300)] text-[var(--color-terracotta-600)] text-sm font-medium hover:bg-[var(--color-terracotta-500)] hover:text-white transition-colors"
            >
              {t("switchLang")}
            </Link>
          </nav>

          {/* Mobile: lang switcher + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href={switchHref}
              aria-label={locale === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
              className="px-2.5 py-1 rounded-full border border-[var(--color-terracotta-300)] text-[var(--color-terracotta-600)] text-xs font-medium"
            >
              {t("switchLang")}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="p-2 rounded-lg text-[var(--color-earth-800)] hover:bg-[var(--color-terracotta-50)]"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-earth-100)] bg-[var(--color-cream)] px-4 py-3 space-y-1">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={`/${locale}${navHrefs[key] === "/" ? "" : navHrefs[key]}`}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(key)
                  ? "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)]"
                  : "text-[var(--color-earth-800)] hover:bg-[var(--color-terracotta-50)]"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
