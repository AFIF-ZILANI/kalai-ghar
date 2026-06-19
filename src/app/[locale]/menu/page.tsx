import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { siteConfig } from "@content/site-config";
import { readMenu } from "@/lib/server/menu";
import { OG_IMAGE, pageAlternates, buildOg } from "@/lib/seo";
import MenuItemSelector from "@/components/menu/MenuItemSelector";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const isBn = locale === "bn";
    const t = await getTranslations("menu");
    const title = `${t("title")} — ${isBn ? "কালাই ঘর" : "Kalai Ghor"}`;
    const description = isBn
        ? "কালাই ঘরের সম্পূর্ণ মেনু — কালাই রুটি, ভর্তা, মাংস, ভাত ও আরও অনেক কিছু।"
        : "Full menu of Kalai Ghor — kalai ruti, bhorta, meat curries, rice and more.";
    return {
        metadataBase: new URL(siteConfig.siteUrl),
        title,
        description,
        alternates: pageAlternates(locale, "/menu"),
        openGraph: buildOg({ locale, title, description, path: "/menu", image: OG_IMAGE }),
        twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    };
}

const CATEGORY_ORDER = ["ruti", "rice", "curry", "bhorta", "side"] as const;

export default async function MenuPage() {
    const locale = await getLocale();
    const isBn = locale === "bn";
    const t = await getTranslations("menu");
    const items = readMenu();

    const categoryLabels: Record<string, string> = {
        ruti:   t("categories.ruti"),
        rice:   t("categories.rice"),
        curry:  t("categories.curry"),
        bhorta: t("categories.bhorta"),
        side:   t("categories.side"),
    };

    const menuJsonLd = {
        "@context": "https://schema.org",
        "@type": "FoodEstablishment",
        name: siteConfig.name,
        url: `${siteConfig.siteUrl}/${locale}`,
        servesCuisine: siteConfig.cuisine,
        hasMenu: {
            "@type": "Menu",
            name: isBn ? "কালাই ঘর মেনু" : "Kalai Ghor Menu",
            hasMenuSection: CATEGORY_ORDER.map((cat) => ({
                "@type": "MenuSection",
                name: categoryLabels[cat],
                hasMenuItem: items.filter((i) => i.category === cat).map((item) => ({
                    "@type": "MenuItem",
                    name: isBn ? item.nameBn : item.nameEn,
                    offers: { "@type": "Offer", price: item.price, priceCurrency: "BDT" },
                })),
            })).filter((s) => s.hasMenuItem.length > 0),
        },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }} />
            <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-20">
                {/* Page header */}
                <div className="mb-10 sm:mb-14">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-terracotta-500)] mb-3">
                        {isBn ? "সম্পূর্ণ মেনু" : "Full Menu"}
                    </p>
                    <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[var(--color-ink)] leading-tight">
                        {t("title")}
                    </h1>
                    <p className="mt-3 text-sm sm:text-base text-[var(--color-ink)]/50">{t("subtitle")}</p>
                    <p className="mt-3 text-sm text-[var(--color-ink)]/40 flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta-400)]" />
                        {isBn
                            ? "আইটেম বেছে নিন এবং নিচের বোতামে ক্লিক করে অর্ডার করুন"
                            : "Select items and tap the button to pre-order"}
                    </p>
                </div>

                <MenuItemSelector
                    items={items}
                    locale={locale}
                    categoryLabels={categoryLabels}
                    categoryOrder={[...CATEGORY_ORDER]}
                />
            </div>
        </>
    );
}
