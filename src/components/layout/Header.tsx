"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

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
    const pathWithoutLocale = pathname.replace(/^\/(bn|en)/, "") || "/";
    const switchHref = `/${otherLocale}${pathWithoutLocale}`;

    const isActive = (key: string) => {
        const href = `/${locale}${navHrefs[key] === "/" ? "" : navHrefs[key]}`;
        return pathname === href || (navHrefs[key] !== "/" && pathname.startsWith(href));
    };

    return (
        <header className="sticky top-0 z-50 bg-[var(--color-cream)]/96 backdrop-blur-md border-b border-[var(--color-earth-100)]">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex items-center justify-between h-[60px]">
                    {/* Logo */}
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-3 group"
                        aria-label={locale === "bn" ? "কালাই ঘর — হোমপেজ" : "Kalai Ghor — Homepage"}
                    >
                        <Image
                            src="/logo.png"
                            alt="Kalai Ghor logo"
                            width={40}
                            height={40}
                            className="shrink-0 transition-opacity group-hover:opacity-80"
                            priority
                        />
                        <span className="flex flex-col leading-none">
                            <span className="font-display text-[20px] font-semibold text-[var(--color-ink)] tracking-tight leading-none">
                                {locale === "bn" ? "কালাই ঘর" : "Kalai Ghor"}
                            </span>
                            <span className="text-[8.5px] font-semibold text-[var(--color-terracotta-500)] uppercase tracking-[0.24em] mt-[3px]">
                                {locale === "bn" ? "রাজশাহী" : "Rajshahi"}
                            </span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-0" aria-label="Main navigation">
                        {navKeys.map((key) => (
                            <Link
                                key={key}
                                href={`/${locale}${navHrefs[key] === "/" ? "" : navHrefs[key]}`}
                                className={`px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                                    isActive(key)
                                        ? "text-[var(--color-terracotta-600)]"
                                        : "text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]"
                                }`}
                            >
                                {t(key)}
                            </Link>
                        ))}
                        {/* Language switcher */}
                        <Link
                            href={switchHref}
                            aria-label={locale === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
                            className="ml-4 px-3.5 py-1.5 border border-[var(--color-ink)]/15 text-[var(--color-ink)]/70 text-[13px] font-medium hover:border-[var(--color-terracotta-400)] hover:text-[var(--color-terracotta-600)] transition-colors"
                        >
                            {t("switchLang")}
                        </Link>
                    </nav>

                    {/* Mobile */}
                    <div className="flex md:hidden items-center gap-3">
                        <Link
                            href={switchHref}
                            aria-label={locale === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
                            className="px-2.5 py-1 border border-[var(--color-ink)]/15 text-[var(--color-ink)]/60 text-xs font-medium"
                        >
                            {t("switchLang")}
                        </Link>
                        <button
                            onClick={() => setOpen(!open)}
                            aria-label={open ? "Close menu" : "Open menu"}
                            aria-expanded={open}
                            className="p-1.5 text-[var(--color-ink)]/70 hover:text-[var(--color-ink)] transition-colors"
                        >
                            {open ? <X size={21} /> : <Menu size={21} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile dropdown */}
            {open && (
                <div className="md:hidden border-t border-[var(--color-earth-100)] bg-[var(--color-cream)] px-6 py-4 space-y-0.5">
                    {navKeys.map((key) => (
                        <Link
                            key={key}
                            href={`/${locale}${navHrefs[key] === "/" ? "" : navHrefs[key]}`}
                            onClick={() => setOpen(false)}
                            className={`block px-3 py-2.5 text-sm font-medium transition-colors ${
                                isActive(key)
                                    ? "text-[var(--color-terracotta-600)]"
                                    : "text-[var(--color-ink)]/70 hover:text-[var(--color-ink)]"
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
