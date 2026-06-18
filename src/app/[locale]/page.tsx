import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, MapPin, Clock, ArrowRight } from "lucide-react";
import { siteConfig, menuItems } from "@content/site-config";
import { formatPrice } from "@/lib/utils";
import LogoSeal from "@/components/LogoSeal";

const CATEGORY_IMAGES: Record<string, string> = {
    ruti: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    bhorta: "https://images.unsplash.com/photo-1565299715199-866c917206bb?auto=format&fit=crop&w=800&q=80",
    curry: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
    combo: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    drink: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
};

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

            {/* ═══ HERO — editorial full-bleed ═══ */}
            <section aria-label={locale === "bn" ? "হিরো" : "Hero"} className="relative min-h-[92svh] flex items-end overflow-hidden">
                {/* Background image */}
                <Image
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=85"
                    alt={locale === "bn" ? "কালাই ঘর রেস্তোরাঁর পরিবেশ" : "Kalai Ghor restaurant atmosphere"}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />
                {/* Gradient overlay — bottom-heavy so the image reads in the upper half */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0905]/90 via-[#0D0905]/40 to-[#0D0905]/10" />

                {/* Seal — centred, upper area of hero */}
                <div className="absolute top-12 sm:top-16 inset-x-0 flex justify-center pointer-events-none select-none">
                    <LogoSeal size={160} variant="light" className="opacity-80 drop-shadow-lg" />
                </div>

                {/* Editorial content — left-aligned, bottom of frame */}
                <div className="relative w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-24">
                    <p className="text-[var(--color-saffron-400)] text-xs font-semibold uppercase tracking-[0.2em] mb-5">
                        {locale === "bn" ? "রাজশাহী, বাংলাদেশ" : "Rajshahi, Bangladesh"}
                    </p>

                    <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-semibold text-white leading-[1.05] tracking-tight max-w-3xl">
                        {t("hero.headline")}{" "}
                        <em className="text-[var(--color-saffron-300)] not-italic">
                            {t("hero.headlineHighlight")}
                        </em>
                    </h1>

                    <div className="mt-6 w-12 h-px bg-[var(--color-saffron-400)]" />

                    <p className="mt-5 max-w-xl text-base sm:text-lg text-white/75 leading-relaxed">
                        {t("hero.subheadline")}
                    </p>

                    <div className="mt-9 flex flex-col sm:flex-row gap-3 items-start">
                        <a
                            href={`https://wa.me/${siteConfig.whatsapp}?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 bg-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-500)] text-white font-semibold px-7 py-3.5 transition-colors text-sm tracking-wide"
                        >
                            <MessageCircle size={17} strokeWidth={2} />
                            {t("hero.ctaWhatsApp")}
                        </a>
                        <a
                            href={`tel:${siteConfig.phone}`}
                            className="inline-flex items-center gap-2.5 border border-white/30 hover:border-white/60 text-white font-medium px-7 py-3.5 transition-colors text-sm tracking-wide"
                        >
                            <Phone size={17} strokeWidth={2} />
                            {t("hero.ctaCall")}
                        </a>
                        <a
                            href={siteConfig.googleMapsDirectionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 border border-white/30 hover:border-white/60 text-white font-medium px-7 py-3.5 transition-colors text-sm tracking-wide"
                        >
                            <MapPin size={17} strokeWidth={2} />
                            {t("hero.ctaDirections")}
                        </a>
                    </div>
                </div>
            </section>

            {/* ═══ WAIT TIME BANNER ═══ */}
            <div className="bg-[var(--color-ink)] text-white/80 border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-3.5 flex flex-col sm:flex-row items-center gap-2">
                    <div className="flex items-center gap-2 shrink-0">
                        <Clock size={15} className="text-[var(--color-saffron-400)]" />
                        <span className="text-xs font-semibold text-[var(--color-saffron-400)] uppercase tracking-widest">
                            {t("waitBanner.label")}
                        </span>
                    </div>
                    <span className="hidden sm:block text-white/20 mx-1">—</span>
                    <p className="text-xs text-center sm:text-left">
                        {siteConfig.waitTime[locale as "bn" | "en"]}
                    </p>
                    <p className="text-xs text-white/40 sm:ml-auto text-center sm:text-right hidden sm:block">
                        {t("waitBanner.note")}
                    </p>
                </div>
            </div>

            {/* ═══ FEATURED DISHES ═══ */}
            <section
                aria-labelledby="featured-heading"
                className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28"
            >
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-terracotta-500)] mb-3">
                            {locale === "bn" ? "বাছাই করা" : "From the Kitchen"}
                        </p>
                        <h2
                            id="featured-heading"
                            className="font-display text-4xl sm:text-5xl font-semibold text-[var(--color-ink)] leading-tight"
                        >
                            {t("featured.title")}
                        </h2>
                    </div>
                    <Link
                        href={`/${locale}/menu`}
                        className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-800)] transition-colors"
                    >
                        {t("featured.viewMenu")}
                        <ArrowRight size={15} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-earth-100)]">
                    {featuredItems.map((item) => {
                        const imgSrc = item.image
                            ? item.image
                            : CATEGORY_IMAGES[item.category] ?? CATEGORY_IMAGES["combo"];
                        return (
                            <div
                                key={item.id}
                                className="group bg-[var(--color-cream)] overflow-hidden"
                            >
                                <div className="relative h-52 overflow-hidden bg-[var(--color-earth-100)]">
                                    <Image
                                        src={imgSrc}
                                        alt={locale === "bn" ? item.nameBn : item.nameEn}
                                        fill
                                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                        loading="lazy"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-[var(--color-ink)]/10 group-hover:bg-[var(--color-ink)]/0 transition-colors duration-500" />
                                </div>
                                <div className="p-6 border-t border-[var(--color-earth-100)]">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-terracotta-500)] mb-1.5">
                                        {item.category}
                                    </p>
                                    <h3 className="font-display text-xl font-semibold text-[var(--color-ink)] leading-snug">
                                        {locale === "bn" ? item.nameBn : item.nameEn}
                                    </h3>
                                    {(locale === "bn" ? item.descriptionBn : item.descriptionEn) && (
                                        <p className="mt-2 text-sm text-[var(--color-earth-800)]/60 leading-relaxed line-clamp-2">
                                            {locale === "bn" ? item.descriptionBn : item.descriptionEn}
                                        </p>
                                    )}
                                    <div className="mt-5 flex items-center justify-between">
                                        <span className="font-display text-lg font-semibold text-[var(--color-terracotta-700)]">
                                            {item.price !== null
                                                ? formatPrice(item.price, locale)
                                                : locale === "bn"
                                                  ? "মূল্য শীঘ্রই"
                                                  : "Price TBD"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 sm:hidden text-center">
                    <Link
                        href={`/${locale}/menu`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-terracotta-600)] border border-[var(--color-terracotta-200)] px-6 py-3 hover:bg-[var(--color-terracotta-50)] transition-colors"
                    >
                        {t("featured.viewMenu")}
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </section>

            {/* ═══ HERITAGE SECTION ═══ */}
            <section aria-labelledby="heritage-heading" className="bg-[var(--color-ink)] text-white overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div>
                        <p className="text-[var(--color-saffron-400)] text-xs font-semibold uppercase tracking-[0.2em] mb-5">
                            {locale === "bn" ? "উত্তরবঙ্গ · রাজশাহী" : "North Bengal · Rajshahi"}
                        </p>
                        <h2
                            id="heritage-heading"
                            className="font-display text-4xl sm:text-5xl font-semibold text-white leading-tight mb-6"
                        >
                            {t("heritageTease.title")}
                        </h2>
                        <div className="w-8 h-px bg-[var(--color-saffron-400)] mb-6" />
                        <p className="text-white/60 leading-relaxed text-base mb-8">
                            {t("heritageTease.body")}
                        </p>
                        <Link
                            href={`/${locale}/story`}
                            className="inline-flex items-center gap-3 text-sm font-semibold text-[var(--color-saffron-400)] hover:text-[var(--color-saffron-300)] transition-colors tracking-wide"
                        >
                            {t("heritageTease.cta")}
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="relative h-72 md:h-96 overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85"
                            alt={locale === "bn" ? "কালাই রুটি তৈরির দৃশ্য" : "Kalai ruti being prepared"}
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-[var(--color-ink)]/20" />
                        {/* Corner accent */}
                        <div className="absolute bottom-4 right-4 w-16 h-16 border border-[var(--color-saffron-400)]/40" />
                        <div className="absolute bottom-2 right-2 w-16 h-16 border border-[var(--color-saffron-400)]/20" />
                    </div>
                </div>
            </section>
        </>
    );
}
