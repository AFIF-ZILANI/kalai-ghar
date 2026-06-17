import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@content/site-config";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations("gallery");
    return {
        metadataBase: new URL(siteConfig.siteUrl),
        title: `${t("title")} — ${locale === "bn" ? "কালাই ঘর" : "Kalai Ghor"}`,
        description: t("subtitle"),
    };
}

/**
 * Add real photos: drop files into public/images/gallery/ and populate
 * the array below with src, altBn, altEn, and optional captions.
 */
const galleryImages: Array<{
    src: string;
    altBn: string;
    altEn: string;
    captionBn?: string;
    captionEn?: string;
}> = [
    // Example (uncomment and replace with real images):
    // {
    //   src: "/images/gallery/ruti-on-tawa.jpg",
    //   altBn: "মাটির তাওয়ায় কালাই রুটি তৈরি হচ্ছে",
    //   altEn: "Kalai ruti being cooked on an earthen tawa",
    // },
];

const PLACEHOLDER_CAPTIONS = {
    bn: [
        "কালাই রুটি তাওয়ায়",
        "হাঁসের মাংস",
        "বেগুন ভর্তা",
        "কম্বো প্লেট",
        "আটা মাখানো",
        "কালাই ঘর রাজশাহী",
        "গরুর ভুনা",
        "মরিচ ভর্তা",
        "রাতের পরিবেশ",
    ],
    en: [
        "Kalai ruti on the tawa",
        "Duck curry",
        "Begun bhorta",
        "Combo plate",
        "Dough preparation",
        "Kalai Ghor Rajshahi",
        "Beef bhuna",
        "Chili bhorta",
        "Evening ambience",
    ],
};

export default async function GalleryPage() {
    const locale = await getLocale();
    const t = await getTranslations("gallery");

    return (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-20">
            {/* Page header */}
            <div className="mb-10 sm:mb-14">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-terracotta-500)] mb-3">
                    {locale === "bn" ? "ফটোগ্যালারি" : "Photography"}
                </p>
                <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[var(--color-ink)] leading-tight">
                    {t("title")}
                </h1>
                <p className="mt-3 text-sm text-[var(--color-ink)]/50">{t("subtitle")}</p>
            </div>

            {galleryImages.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-px space-y-px">
                    {galleryImages.map((img, idx) => (
                        <figure key={idx} className="break-inside-avoid overflow-hidden">
                            <Image
                                src={img.src}
                                alt={locale === "bn" ? img.altBn : img.altEn}
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover"
                                loading="lazy"
                            />
                            {(img.captionBn || img.captionEn) && (
                                <figcaption className="px-3 py-2 text-[11px] text-[var(--color-ink)]/40 bg-[var(--color-cream)]">
                                    {locale === "bn" ? img.captionBn : img.captionEn}
                                </figcaption>
                            )}
                        </figure>
                    ))}
                </div>
            ) : (
                /* Placeholder grid — no emojis, styled with brand language */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[var(--color-earth-100)]">
                    {PLACEHOLDER_CAPTIONS[locale as "bn" | "en"].map((caption, i) => (
                        <div
                            key={i}
                            className="bg-[var(--color-earth-50)] aspect-square flex flex-col items-center justify-center gap-3 p-5"
                        >
                            {/* Abstract brand-mark stand-in */}
                            <div className="w-8 h-8 border border-[var(--color-terracotta-300)] rotate-45 flex items-center justify-center">
                                <div className="w-2 h-2 bg-[var(--color-terracotta-400)]" />
                            </div>
                            <span className="text-xs text-[var(--color-ink)]/40 text-center leading-snug">
                                {caption}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Owner instruction — only visible in dev/admin context */}
            <div className="mt-8 border-t border-[var(--color-earth-100)] pt-6 text-sm text-[var(--color-ink)]/40">
                <p className="font-medium text-[var(--color-ink)]/60 mb-1">
                    {locale === "bn" ? "ছবি যোগ করবেন কীভাবে" : "How to add photos"}
                </p>
                <p className="leading-relaxed">
                    {locale === "bn"
                        ? "public/images/gallery/ ফোল্ডারে ছবি রাখুন এবং src/app/[locale]/gallery/page.tsx-এ galleryImages অ্যারে আপডেট করুন।"
                        : "Add photos to public/images/gallery/ and update the galleryImages array in src/app/[locale]/gallery/page.tsx."}
                </p>
            </div>
        </div>
    );
}
