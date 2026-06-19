import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { MessageCircle, ArrowRight } from "lucide-react";
import { menuItems, siteConfig } from "@content/site-config";
import { getContactData } from "@/lib/server/contact";
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@content/site-config";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations("menu");
    return {
        metadataBase: new URL(siteConfig.siteUrl),
        title: `${t("title")} — ${locale === "bn" ? "কালাই ঘর" : "Kalai Ghor"}`,
        description: t("subtitle"),
    };
}

const categoryOrder = ["ruti", "bhorta", "curry", "combo", "drink"] as const;

function groupByCategory(items: MenuItem[]) {
    return categoryOrder.reduce(
        (acc, cat) => {
            const filtered = items.filter((i) => i.category === cat);
            if (filtered.length) acc[cat] = filtered;
            return acc;
        },
        {} as Record<string, MenuItem[]>,
    );
}

export default async function MenuPage() {
    const locale = await getLocale();
    const t = await getTranslations("menu");

    const contact = getContactData();
    const grouped = groupByCategory(menuItems);

    const whatsappMsg = encodeURIComponent(
        locale === "bn"
            ? "নমস্কার কালাই ঘর! আমি মেনু দেখে অর্ডার দিতে চাই।"
            : "Hello Kalai Ghor! I'd like to order from the menu.",
    );

    return (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-20">
            {/* Page header */}
            <div className="mb-10 sm:mb-14">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-terracotta-500)] mb-3">
                    {locale === "bn" ? "সম্পূর্ণ মেনু" : "Full Menu"}
                </p>
                <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[var(--color-ink)] leading-tight">
                    {t("title")}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-[var(--color-ink)]/50 mt-3">{t("subtitle")}</p>
            </div>

            <div className="space-y-12 sm:space-y-16">
                {Object.entries(grouped).map(([cat, items], catIdx) => (
                    <section key={cat} aria-labelledby={`cat-${cat}`}>
                        {/* Category heading with rule */}
                        <div className="flex items-baseline gap-4 mb-6 border-b border-[var(--color-earth-100)] pb-3">
                            <h2
                                id={`cat-${cat}`}
                                className="font-display text-xl sm:text-2xl font-semibold text-[var(--color-ink)]"
                            >
                                {t(`categories.${cat as "ruti" | "bhorta" | "curry" | "combo" | "drink"}`)}
                            </h2>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink)]/30">
                                {String(catIdx + 1).padStart(2, "0")}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-earth-100)]">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-[var(--color-cream)] p-5 sm:p-6 flex flex-col gap-2"
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <h3 className="font-semibold text-[var(--color-ink)] text-base leading-snug">
                                            {locale === "bn" ? item.nameBn : item.nameEn}
                                        </h3>
                                        <span className="shrink-0 font-display font-semibold text-[var(--color-terracotta-600)] text-base">
                                            {item.price !== null
                                                ? formatPrice(item.price, locale)
                                                : "—"}
                                        </span>
                                    </div>

                                    <p className="text-[11px] text-[var(--color-ink)]/35 tracking-wide">
                                        {locale === "bn" ? item.nameEn : item.nameBn}
                                    </p>

                                    {(locale === "bn" ? item.descriptionBn : item.descriptionEn) && (
                                        <p className="text-sm text-[var(--color-ink)]/55 leading-relaxed flex-1">
                                            {locale === "bn" ? item.descriptionBn : item.descriptionEn}
                                        </p>
                                    )}

                                    {item.price === null && (
                                        <p className="text-[11px] text-[var(--color-saffron-600)]">
                                            {t("todoPriceNote")}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-14 sm:mt-20 border-t border-[var(--color-earth-100)] pt-10">
                <p className="text-sm text-[var(--color-ink)]/50 mb-5 text-center sm:text-left">
                    {locale === "bn"
                        ? "অর্ডার করতে WhatsApp-এ মেসেজ করুন বা আগাম অর্ডার দিন"
                        : "Message us on WhatsApp to place an order or pre-order for your visit"}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <a
                        href={`https://wa.me/${contact.whatsapp}?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb856] text-white font-semibold px-6 py-4 sm:py-3 transition-colors text-sm tracking-wide"
                    >
                        <MessageCircle size={17} strokeWidth={2} />
                        {t("orderWhatsApp")}
                    </a>
                    <Link
                        href={`/${locale}/reserve`}
                        className="flex items-center justify-center gap-2 border border-[var(--color-ink)]/15 text-[var(--color-ink)]/60 hover:border-[var(--color-ink)]/40 hover:text-[var(--color-ink)] font-medium px-6 py-4 sm:py-3 transition-colors text-sm"
                    >
                        {locale === "bn" ? "আগাম অর্ডার" : "Pre-order"}
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
