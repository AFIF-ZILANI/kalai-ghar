import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { siteConfig, menuItems } from "@content/site-config";
import { formatPrice } from "@/lib/utils";

export default async function HomePage() {
    const locale = await getLocale();
    const t = await getTranslations();

    const featuredItems = menuItems.filter((item) => item.featured);

    const whatsappMsg = encodeURIComponent(
        locale === "bn"
            ? "নমস্কার কালাই ঘর! আমি অর্ডার দিতে চাই।"
            : "Hello Kalai Ghor! I'd like to place an order.",
    );

    return (
        <>
            {/* JSON-LD Restaurant Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Restaurant",
                        name: siteConfig.name,
                        alternateName: siteConfig.nameBn,
                        description: locale === "bn" ? siteConfig.taglineBn : siteConfig.tagline,
                        url: `${siteConfig.siteUrl}/${locale}`,
                        telephone: siteConfig.phone,
                        address: {
                            "@type": "PostalAddress",
                            streetAddress: siteConfig.address.street,
                            addressLocality: siteConfig.address.city,
                            addressCountry: "BD",
                        },
                        geo: {
                            "@type": "GeoCoordinates",
                            latitude: siteConfig.geo.lat,
                            longitude: siteConfig.geo.lng,
                        },
                        servesCuisine: siteConfig.cuisine,
                        priceRange: siteConfig.priceRange,
                    }),
                }}
            />

            {/* ═══ HERO ═══ */}
            <section
                aria-label={locale === "bn" ? "হিরো" : "Hero"}
                className="relative min-h-[90svh] flex items-center overflow-hidden bg-gradient-to-br from-[var(--color-terracotta-900)] via-[var(--color-terracotta-700)] to-[var(--color-earth-800)]"
            >
                {/* Subtle texture overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    }}
                />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <p className="text-[var(--color-saffron-400)] text-sm font-semibold uppercase tracking-widest mb-4">
                        {locale === "bn" ? "রাজশাহী, বাংলাদেশ" : "Rajshahi, Bangladesh"}
                    </p>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
                        {t("hero.headline")}{" "}
                        <span className="text-[var(--color-saffron-400)] block sm:inline">
                            {t("hero.headlineHighlight")}
                        </span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[var(--color-terracotta-100)] mt-6 leading-relaxed">
                        {t("hero.subheadline")}
                    </p>

                    {/* CTAs */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href={`https://wa.me/${siteConfig.whatsapp}?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb856] text-white font-semibold px-7 py-3.5 rounded-full shadow-lg transition-colors text-base"
                        >
                            <MessageCircle size={20} />
                            {t("hero.ctaWhatsApp")}
                        </a>
                        <a
                            href={`tel:${siteConfig.phone}`}
                            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/40 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-base"
                        >
                            <Phone size={20} />
                            {t("hero.ctaCall")}
                        </a>
                        <a
                            href={siteConfig.googleMapsDirectionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/40 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-base"
                        >
                            <MapPin size={20} />
                            {t("hero.ctaDirections")}
                        </a>
                    </div>
                </div>
            </section>

            {/* ═══ WAIT TIME BANNER ═══ */}
            <div className="bg-[var(--color-saffron-500)] text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex items-center gap-2 shrink-0">
                        <Clock size={20} />
                        <span className="font-semibold text-sm">{t("waitBanner.label")}:</span>
                    </div>
                    <p className="text-sm text-center sm:text-left">
                        {siteConfig.waitTime[locale as "bn" | "en"]}
                    </p>
                    <p className="text-xs text-white/80 sm:ml-auto text-center sm:text-right">
                        {t("waitBanner.note")}
                    </p>
                </div>
            </div>

            {/* ═══ FEATURED DISHES ═══ */}
            <section
                aria-labelledby="featured-heading"
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
            >
                <h2
                    id="featured-heading"
                    className="text-2xl sm:text-3xl font-bold text-[var(--color-terracotta-700)] mb-2"
                >
                    {t("featured.title")}
                </h2>
                <div className="w-16 h-1 bg-[var(--color-terracotta-500)] rounded-full mb-8" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredItems.map((item) => (
                        <div
                            key={item.id}
                            className="group rounded-2xl overflow-hidden border border-[var(--color-earth-100)] bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Placeholder image block */}
                            <div className="h-44 bg-gradient-to-br from-[var(--color-terracotta-100)] to-[var(--color-terracotta-200)] flex items-center justify-center">
                                <span className="text-5xl" aria-hidden="true">
                                    {item.category === "ruti"
                                        ? "🫓"
                                        : item.category === "curry"
                                          ? "🍲"
                                          : item.category === "bhorta"
                                            ? "🥬"
                                            : "🍽️"}
                                </span>
                            </div>
                            <div className="p-5">
                                <h3 className="font-semibold text-[var(--color-earth-800)] text-base">
                                    {locale === "bn" ? item.nameBn : item.nameEn}
                                </h3>
                                {(locale === "bn" ? item.descriptionBn : item.descriptionEn) && (
                                    <p className="mt-1 text-sm text-[var(--color-earth-800)]/70 leading-relaxed">
                                        {locale === "bn" ? item.descriptionBn : item.descriptionEn}
                                    </p>
                                )}
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-[var(--color-terracotta-600)] font-semibold text-sm">
                                        {item.price !== null
                                            ? formatPrice(item.price, locale)
                                            : locale === "bn"
                                              ? "মূল্য শীঘ্রই"
                                              : "Price TBD"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href={`/${locale}/menu`}
                        className="inline-block bg-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-700)] text-white font-semibold px-8 py-3 rounded-full transition-colors"
                    >
                        {t("featured.viewMenu")}
                    </Link>
                </div>
            </section>

            {/* ═══ HERITAGE TEASER ═══ */}
            <section
                aria-labelledby="heritage-heading"
                className="bg-gradient-to-r from-[var(--color-earth-800)] to-[var(--color-earth-900)] text-white"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <p className="text-[var(--color-saffron-400)] text-xs font-semibold uppercase tracking-widest mb-3">
                            {locale === "bn" ? "উত্তরবঙ্গ · রাজশাহী" : "North Bengal · Rajshahi"}
                        </p>
                        <h2
                            id="heritage-heading"
                            className="text-2xl sm:text-3xl font-bold text-white mb-5 leading-snug"
                        >
                            {t("heritageTease.title")}
                        </h2>
                        <p className="text-[var(--color-earth-200)] leading-relaxed mb-7">
                            {t("heritageTease.body")}
                        </p>
                        <Link
                            href={`/${locale}/story`}
                            className="inline-flex items-center gap-2 text-[var(--color-saffron-400)] font-semibold hover:text-[var(--color-saffron-300)] transition-colors"
                        >
                            {t("heritageTease.cta")} →
                        </Link>
                    </div>
                    {/* Decorative block */}
                    <div className="hidden md:flex items-center justify-center">
                        <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-[var(--color-terracotta-700)] to-[var(--color-terracotta-900)] flex items-center justify-center opacity-80">
                            <span className="text-9xl" aria-hidden="true">
                                🫓
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
