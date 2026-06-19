import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@content/site-config";
import { OG_IMAGE, pageAlternates, buildOg } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const isBn = locale === "bn";
    const t = await getTranslations("story");
    const title = `${t("title")} — ${isBn ? "কালাই ঘর" : "Kalai Ghor"}`;
    const description = isBn
        ? "কালাই রুটির গল্প — মাশকালাই ডালের আটায় মাটির তাওয়ায় তৈরি চাঁপাইনবাবগঞ্জের শতবর্ষী ঐতিহ্যবাহী খাবার।"
        : "The story of kalai ruti — a century-old flatbread from Chapainawabganj, made from black-gram flour on an earthen tawa, now beloved across North Bengal.";
    return {
        metadataBase: new URL(siteConfig.siteUrl),
        title,
        description,
        alternates: pageAlternates(locale, "/story"),
        openGraph: buildOg({ locale, title, description, path: "/story", image: OG_IMAGE }),
        twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    };
}

export default async function StoryPage() {
    const locale = await getLocale();
    const isBn = locale === "bn";
    const t = await getTranslations("story");

    const sections = [
        { titleKey: "section1Title", bodyKey: "section1Body" },
        { titleKey: "section2Title", bodyKey: "section2Body" },
        { titleKey: "section3Title", bodyKey: "section3Body" },
    ] as const;

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: isBn ? "কালাই রুটির ঐতিহ্য" : "The Heritage of Kalai Ruti",
        description: isBn
            ? "চাঁপাইনবাবগঞ্জের শত বছরের ঐতিহ্যবাহী কালাই রুটির গল্প"
            : "A century-old flatbread tradition from Chapainawabganj",
        url: `${siteConfig.siteUrl}/${locale}/story`,
        publisher: {
            "@type": "Restaurant",
            name: siteConfig.name,
            url: `${siteConfig.siteUrl}/${locale}`,
            logo: { "@type": "ImageObject", url: `${siteConfig.siteUrl}/logo.png` },
        },
        about: {
            "@type": "Thing",
            name: isBn ? "কালাই রুটি" : "Kalai Ruti",
            description: isBn
                ? "মাশকালাই ডালের আটা ও আতপ চালের আটায় তৈরি বাংলাদেশের ঐতিহ্যবাহী রুটি"
                : "Traditional Bangladeshi flatbread made from black-gram and rice flour",
        },
        image: `${siteConfig.siteUrl}${OG_IMAGE.url}`,
        inLanguage: isBn ? "bn" : "en",
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
            <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-20">
                {/* Page header */}
                <div className="mb-12 sm:mb-16">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-terracotta-500)] mb-3">
                        {isBn ? "আমাদের গল্প" : "Our Story"}
                    </p>
                    <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[var(--color-ink)] leading-tight">
                        {t("title")}
                    </h1>
                    <p className="mt-3 text-sm sm:text-base text-[var(--color-ink)]/50">{t("subtitle")}</p>
                    <div className="mt-6 w-10 h-px bg-[var(--color-terracotta-400)]" />
                </div>

                {/* Story sections */}
                <div className="space-y-0">
                    {sections.map(({ titleKey, bodyKey }, idx) => (
                        <section
                            key={titleKey}
                            className="grid grid-cols-[32px_1fr] gap-5 sm:gap-8 pb-10 sm:pb-14 border-b border-[var(--color-earth-100)] mb-10 sm:mb-14 last:border-0 last:mb-0 last:pb-0"
                        >
                            <div className="pt-1">
                                <span className="font-display text-xs text-[var(--color-terracotta-400)] font-semibold">
                                    {String(idx + 1).padStart(2, "0")}
                                </span>
                            </div>
                            <div>
                                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[var(--color-ink)] mb-4 leading-snug">
                                    {t(titleKey)}
                                </h2>
                                <p className="text-[var(--color-ink)]/65 leading-loose text-base sm:text-lg">
                                    {t(bodyKey)}
                                </p>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Heritage callout */}
                <div className="bg-[var(--color-ink)] text-white p-7 sm:p-10 mt-2">
                    <div className="w-6 h-px bg-[var(--color-saffron-400)] mb-5" />
                    <p className="font-display text-lg sm:text-xl font-semibold text-[var(--color-saffron-300)] leading-snug mb-3">
                        {isBn
                            ? "আমেরিকার সাবেক রাষ্ট্রদূত রাজশাহীতে আসেন কালাই রুটির জন্য"
                            : "A former US Ambassador to Bangladesh visited Rajshahi specifically for kalai ruti"}
                    </p>
                    <p className="text-sm text-white/40">
                        {isBn
                            ? "— কালাই ঘরের গল্প এখন রাজশাহীর বাইরেও ছড়িয়ে পড়েছে"
                            : "— A testament to how far the story of Kalai Ghor has spread"}
                    </p>
                </div>

                {/* CTAs */}
                <div className="mt-10 flex flex-col sm:flex-row gap-3">
                    <Link
                        href={`/${locale}/menu`}
                        className="flex items-center justify-center gap-2 bg-[var(--color-ink)] hover:bg-[var(--color-terracotta-700)] text-white font-semibold px-6 py-4 sm:py-3 transition-colors text-sm tracking-wide"
                    >
                        {isBn ? "মেনু দেখুন" : "View Our Menu"}
                        <ArrowRight size={15} />
                    </Link>
                    <Link
                        href={`/${locale}/visit`}
                        className="flex items-center justify-center gap-2 border border-[var(--color-ink)]/15 text-[var(--color-ink)]/60 hover:border-[var(--color-ink)]/40 hover:text-[var(--color-ink)] font-medium px-6 py-4 sm:py-3 transition-colors text-sm"
                    >
                        {isBn ? "আমাদের কাছে আসুন" : "Plan Your Visit"}
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </div>
        </>
    );
}
