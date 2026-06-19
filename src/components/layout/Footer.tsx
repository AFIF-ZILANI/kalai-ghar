import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { toWaNumber } from "@/lib/whatsapp";
import { siteConfig } from "@content/site-config";

type Props = {
    phone: string;
    whatsapp: string;
    address: { area: string; city: string; street: string; dhakaStreet: string };
};

export default function Footer({ phone, whatsapp, address }: Props) {
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
        <footer className="bg-(--color-ink) text-white/60">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Top rule */}
                <div className="border-t border-white/8 pt-14 pb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-16">
                        {/* Brand */}
                        <div>
                            <p className="font-display text-2xl font-semibold text-white tracking-tight mb-2">
                                {locale === "bn" ? "কালাই ঘর" : "Kalai Ghor"}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-(--color-saffron-400) mb-4">
                                {locale === "bn" ? "রাজশাহী, বাংলাদেশ" : "Rajshahi, Bangladesh"}
                            </p>
                            <p className="text-sm text-white/45 leading-relaxed">{t("tagline")}</p>
                        </div>

                        {/* Quick links */}
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 mb-4">
                                {t("quickLinks")}
                            </p>
                            <ul className="space-y-2.5">
                                {navLinks.map(({ key, href }) => (
                                    <li key={key}>
                                        <Link
                                            href={href}
                                            className="text-[13px] text-white/50 hover:text-white transition-colors"
                                        >
                                            {nav(key)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 mb-4">
                                {t("contact")}
                            </p>
                            <ul className="space-y-3.5 text-[13px]">
                                <li className="flex items-start gap-2.5">
                                    <MapPin size={14} className="mt-0.5 shrink-0 text-(--color-terracotta-400)" />
                                    <span className="text-white/50">
                                        {address.area}, {address.city}
                                    </span>
                                </li>
                                <li>
                                    <a
                                        href={`tel:${phone}`}
                                        className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors"
                                    >
                                        <Phone size={14} className="text-(--color-terracotta-400)" />
                                        {phone === "TODO_PHONE_NUMBER" ? "—" : phone}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={`https://wa.me/${toWaNumber(whatsapp)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors"
                                    >
                                        <MessageCircle size={14} className="text-(--color-terracotta-400)" />
                                        WhatsApp
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom rule */}
                <div className="border-t border-white/8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-[11px] text-white/25">{t("copyright")}</p>
                    <p className="text-[11px] text-white/20">{siteConfig.priceRange} · {siteConfig.cuisine.join(" · ")}</p>
                </div>
            </div>
        </footer>
    );
}
