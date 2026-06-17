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

type GalleryImage = {
    /** Unsplash photo ID */
    unsplashId: string;
    altBn: string;
    altEn: string;
    captionBn: string;
    captionEn: string;
    /** Controls rendered height in the masonry column */
    aspect: "landscape" | "square" | "portrait";
};

/**
 * Seeded with Unsplash placeholders (Unsplash License — free for commercial use).
 * Replace with real photos: drop into public/images/gallery/ and swap unsplashId
 * for a local /images/gallery/filename.jpg src path.
 *
 * Credits: Zoshua Colah · Imad 786 · Toa Heftiba · Olimpia Davies · Cphotos
 * (all via Unsplash)
 */
const galleryImages: GalleryImage[] = [
    {
        unsplashId: "bKrLCNjS_oQ",
        altBn: "মাটির তাওয়ায় কালাই রুটি তৈরি হচ্ছে",
        altEn: "Kalai ruti being cooked on a tawa",
        captionBn: "কালাই রুটি তাওয়ায়",
        captionEn: "Kalai ruti on the tawa",
        aspect: "landscape",
    },
    {
        unsplashId: "gwUA_pHaOYY",
        altBn: "হাঁসের মাংস ও ভাত — কম্বো প্লেট",
        altEn: "Curry and rice — combo plate",
        captionBn: "কম্বো প্লেট",
        captionEn: "Combo plate",
        aspect: "square",
    },
    {
        unsplashId: "EXY9vpK3pAs",
        altBn: "বেগুন ভর্তার জন্য কাটা বেগুন",
        altEn: "Sliced eggplant for begun bhorta",
        captionBn: "বেগুন ভর্তা",
        captionEn: "Begun bhorta",
        aspect: "square",
    },
    {
        unsplashId: "MJNq-3Q78P4",
        altBn: "কালাই ঘর রাজশাহীর পরিবেশ",
        altEn: "Kalai Ghor Rajshahi — the stall",
        captionBn: "কালাই ঘর রাজশাহী",
        captionEn: "Kalai Ghor Rajshahi",
        aspect: "landscape",
    },
    {
        unsplashId: "paoGDZSd4cY",
        altBn: "কালাই রুটির আটা মাখানো হচ্ছে",
        altEn: "Dough preparation for kalai ruti",
        captionBn: "আটা মাখানো",
        captionEn: "Dough preparation",
        aspect: "landscape",
    },
    {
        unsplashId: "TIJEY5Vb8Ng",
        altBn: "তাজা বেগুন — ভর্তার উপকরণ",
        altEn: "Fresh eggplant — key ingredient for bhorta",
        captionBn: "তাজা উপকরণ",
        captionEn: "Fresh ingredients",
        aspect: "square",
    },
    {
        unsplashId: "ZSukCSw5VV4",
        altBn: "রুটি ও মাংস কারি প্লেট",
        altEn: "Ruti with meat curry on a plate",
        captionBn: "রুটি ও কারি",
        captionEn: "Ruti & curry",
        aspect: "landscape",
    },
    {
        unsplashId: "Wqgpy1qdV4c",
        altBn: "হাতে তৈরি কালাই রুটি",
        altEn: "Hand-pressed kalai ruti",
        captionBn: "হাতে তৈরি রুটি",
        captionEn: "Hand-pressed ruti",
        aspect: "landscape",
    },
    {
        unsplashId: "d_kabh_WX9E",
        altBn: "রাতের কালাই ঘর — আলোকিত পরিবেশ",
        altEn: "Evening ambience at Kalai Ghor",
        captionBn: "রাতের পরিবেশ",
        captionEn: "Evening ambience",
        aspect: "landscape",
    },
];

const ASPECT_DIMS: Record<GalleryImage["aspect"], { w: number; h: number }> = {
    landscape: { w: 800, h: 534 },
    square: { w: 800, h: 800 },
    portrait: { w: 640, h: 853 },
};

function unsplashSrc(id: string): string {
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=85`;
}

export default async function GalleryPage() {
    const locale = await getLocale();
    const t = await getTranslations("gallery");

    return (
        <div className="pb-10 sm:pb-20">
            {/* Page header */}
            <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-12 sm:pt-20 pb-8 sm:pb-12">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-terracotta-500)] mb-3">
                    {locale === "bn" ? "ফটোগ্যালারি" : "Photography"}
                </p>
                <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[var(--color-ink)] leading-tight">
                    {t("title")}
                </h1>
                <p className="mt-3 text-sm text-[var(--color-ink)]/50">{t("subtitle")}</p>
            </div>

            {/* Full-bleed masonry grid */}
            <div className="columns-2 sm:columns-3 gap-px bg-[var(--color-earth-100)]">
                {galleryImages.map((img, idx) => {
                    const dims = ASPECT_DIMS[img.aspect];
                    return (
                        <figure key={idx} className="break-inside-avoid overflow-hidden mb-px">
                            <div className="overflow-hidden bg-[var(--color-earth-50)]">
                                <Image
                                    src={unsplashSrc(img.unsplashId)}
                                    alt={locale === "bn" ? img.altBn : img.altEn}
                                    width={dims.w}
                                    height={dims.h}
                                    className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-700"
                                    loading={idx < 4 ? "eager" : "lazy"}
                                    sizes="(min-width: 640px) 33vw, 50vw"
                                />
                            </div>
                            <figcaption className="px-3 py-2 text-[11px] text-[var(--color-ink)]/40 bg-[var(--color-cream)] leading-tight">
                                {locale === "bn" ? img.captionBn : img.captionEn}
                            </figcaption>
                        </figure>
                    );
                })}
            </div>

            {/* Attribution note */}
            <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 mt-6">
                <p className="text-[10px] text-[var(--color-ink)]/25 leading-relaxed">
                    {locale === "bn"
                        ? "ছবি: Unsplash (প্রতিনিধিত্বমূলক)। আসল রেস্তোরাঁর ছবি যোগ করতে public/images/gallery/ ফোল্ডার ব্যবহার করুন।"
                        : "Photos: Unsplash (representative). Replace with real photos by adding files to public/images/gallery/ and updating gallery/page.tsx."}
                </p>
            </div>
        </div>
    );
}
