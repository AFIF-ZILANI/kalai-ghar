import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@content/site-config";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations("story");
    return {
        metadataBase: new URL(siteConfig.siteUrl),
        title: `${t("title")} — ${locale === "bn" ? "কালাই ঘর" : "Kalai Ghor"}`,
        description: t("subtitle"),
    };
}

export default async function StoryPage() {
    const locale = await getLocale();
    const t = await getTranslations("story");

    const sections = [
        { titleKey: "section1Title", bodyKey: "section1Body", icon: "🌾" },
        { titleKey: "section2Title", bodyKey: "section2Body", icon: "🏠" },
        { titleKey: "section3Title", bodyKey: "section3Body", icon: "📦" },
    ] as const;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="text-center mb-14">
                <p className="text-[var(--color-saffron-600)] text-xs font-semibold uppercase tracking-widest mb-3">
                    {locale === "bn" ? "আমাদের গল্প" : "Our Story"}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-terracotta-700)] leading-tight">
                    {t("title")}
                </h1>
                <p className="mt-3 text-[var(--color-earth-800)]/70">{t("subtitle")}</p>
                <div className="w-20 h-1 bg-[var(--color-terracotta-500)] rounded-full mx-auto mt-5" />
            </div>

            {/* Story sections */}
            <div className="space-y-12">
                {sections.map(({ titleKey, bodyKey, icon }) => (
                    <section key={titleKey} className="grid md:grid-cols-[60px_1fr] gap-6">
                        <div className="hidden md:flex justify-center pt-1">
                            <span className="text-4xl" aria-hidden="true">
                                {icon}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-earth-800)] mb-4 flex items-center gap-3">
                                <span className="md:hidden text-2xl" aria-hidden="true">
                                    {icon}
                                </span>
                                {t(titleKey)}
                            </h2>
                            <p className="text-[var(--color-earth-800)]/80 leading-loose text-base sm:text-lg">
                                {t(bodyKey)}
                            </p>
                        </div>
                    </section>
                ))}
            </div>

            {/* Heritage callout */}
            <div className="mt-14 rounded-2xl bg-gradient-to-br from-[var(--color-terracotta-700)] to-[var(--color-earth-800)] text-white p-8 text-center">
                <p className="text-2xl mb-3" aria-hidden="true">
                    🏅
                </p>
                <p className="font-semibold text-lg text-[var(--color-saffron-300)] mb-2">
                    {locale === "bn"
                        ? "আমেরিকার সাবেক রাষ্ট্রদূত রাজশাহীতে আসেন কালাই রুটির জন্য"
                        : "A former US Ambassador to Bangladesh visited Rajshahi specifically for kalai ruti"}
                </p>
                <p className="text-sm text-[var(--color-terracotta-100)]/80">
                    {locale === "bn"
                        ? "— কালাই ঘরের গল্প এখন রাজশাহীর বাইরেও ছড়িয়ে পড়েছে"
                        : "— A testament to how far the story of Kalai Ghor has spread"}
                </p>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href={`/${locale}/menu`}
                    className="inline-block text-center bg-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-700)] text-white font-semibold px-8 py-3 rounded-full transition-colors"
                >
                    {locale === "bn" ? "মেনু দেখুন" : "View Our Menu"}
                </Link>
                <Link
                    href={`/${locale}/visit`}
                    className="inline-block text-center border-2 border-[var(--color-terracotta-500)] text-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-50)] font-semibold px-8 py-3 rounded-full transition-colors"
                >
                    {locale === "bn" ? "আমাদের কাছে আসুন" : "Plan Your Visit"}
                </Link>
            </div>
        </div>
    );
}
