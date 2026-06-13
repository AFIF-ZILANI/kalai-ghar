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
 * Gallery images — add real photos to public/images/gallery/
 * and update this array. Each image needs bilingual alt text.
 * TODO: Replace placeholder entries with real photos from the owner.
 */
const galleryImages: Array<{
    src: string;
    altBn: string;
    altEn: string;
    captionBn?: string;
    captionEn?: string;
}> = [
    // TODO: Add real images, e.g.:
    // {
    //   src: "/images/gallery/ruti-on-tawa.jpg",
    //   altBn: "মাটির তাওয়ায় কালাই রুটি তৈরি হচ্ছে",
    //   altEn: "Kalai ruti being cooked on an earthen tawa",
    //   captionBn: "মাটির তাওয়ায় হাতে তৈরি কালাই রুটি",
    //   captionEn: "Hand-pressed kalai ruti on the earthen tawa",
    // },
];

const placeholders = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    emoji: ["🫓", "🍲", "🥬", "🍽️", "🌾", "🫓", "🍲", "🥬", "🍽️"][i],
    captionBn: [
        "কালাই রুটি তাওয়ায়",
        "হাঁসের মাংস",
        "বেগুন ভর্তা",
        "কম্বো প্লেট",
        "আটা মাখানো",
        "কালাই ঘর রাজশাহী",
        "গরুর ভুনা",
        "মরিচ ভর্তা",
        "রাতের পরিবেশ",
    ][i],
    captionEn: [
        "Kalai ruti on the tawa",
        "Duck curry",
        "Begun bhorta",
        "Combo plate",
        "Dough preparation",
        "Kalai Ghor Rajshahi",
        "Beef bhuna",
        "Chili bhorta",
        "Evening ambience",
    ][i],
}));

export default async function GalleryPage() {
    const locale = await getLocale();
    const t = await getTranslations("gallery");

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-terracotta-700)]">
                    {t("title")}
                </h1>
                <p className="mt-2 text-[var(--color-earth-800)]/70">{t("subtitle")}</p>
                <div className="w-20 h-1 bg-[var(--color-terracotta-500)] rounded-full mx-auto mt-4" />
            </div>

            {galleryImages.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {galleryImages.map((img, idx) => (
                        <figure
                            key={idx}
                            className="break-inside-avoid rounded-2xl overflow-hidden border border-[var(--color-earth-100)] shadow-sm"
                        >
                            <Image
                                src={img.src}
                                alt={locale === "bn" ? img.altBn : img.altEn}
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover"
                                loading="lazy"
                            />
                            {(img.captionBn || img.captionEn) && (
                                <figcaption className="px-4 py-2 text-xs text-[var(--color-earth-800)]/60">
                                    {locale === "bn" ? img.captionBn : img.captionEn}
                                </figcaption>
                            )}
                        </figure>
                    ))}
                </div>
            ) : (
                // Placeholder grid until real photos are added
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {placeholders.map((p) => (
                        <div
                            key={p.id}
                            className="rounded-2xl bg-gradient-to-br from-[var(--color-terracotta-50)] to-[var(--color-terracotta-100)] aspect-square flex flex-col items-center justify-center gap-3 border border-[var(--color-terracotta-100)]"
                        >
                            <span className="text-5xl" aria-hidden="true">
                                {p.emoji}
                            </span>
                            <span className="text-xs text-[var(--color-earth-800)]/60 text-center px-3">
                                {locale === "bn" ? p.captionBn : p.captionEn}
                            </span>
                            <span className="text-[10px] text-[var(--color-terracotta-400)] italic">
                                TODO: add photo
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-10 rounded-xl bg-[var(--color-earth-50)] border border-[var(--color-earth-100)] p-5 text-sm text-[var(--color-earth-800)]/70">
                <p className="font-medium text-[var(--color-earth-800)] mb-1">
                    {locale === "bn" ? "ছবি যোগ করার নির্দেশিকা" : "How to add photos"}
                </p>
                <p>
                    {locale === "bn"
                        ? "public/images/gallery/ ফোল্ডারে ছবি রাখুন এবং src/app/[locale]/gallery/page.tsx-এ galleryImages অ্যারে আপডেট করুন।"
                        : "Add photos to public/images/gallery/ and update the galleryImages array in src/app/[locale]/gallery/page.tsx."}
                </p>
            </div>
        </div>
    );
}
