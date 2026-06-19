import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { siteConfig } from "@content/site-config";
import { readGallery } from "@/lib/server/gallery";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { OG_IMAGE, pageAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const isBn = locale === "bn";

    const title = isBn
        ? `গ্যালারি — কালাই ঘর রাজশাহী`
        : `Gallery — Kalai Ghor Rajshahi`;
    const description = isBn
        ? `কালাই ঘরের তাওয়া, রান্নাঘর, খাবার ও পরিবেশের আসল ছবি। চাঁপাইনবাবগঞ্জের ঐতিহ্যবাহী কালাই রুটির দৃশ্য।`
        : `Authentic photos of Kalai Ghor's kitchen, food, and ambience. The legendary kalai ruti from Chapainawabganj, captured in pictures.`;

    return {
        metadataBase: new URL(siteConfig.siteUrl),
        title,
        description,
        alternates: pageAlternates(locale, "/gallery"),
        openGraph: {
            title,
            description,
            url: `${siteConfig.siteUrl}/${locale}/gallery`,
            siteName: siteConfig.name,
            images: [OG_IMAGE],
            locale: isBn ? "bn_BD" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [OG_IMAGE.url],
        },
    };
}

export default async function GalleryPage() {
    const locale = await getLocale();
    const isBn = locale === "bn";
    const galleryImages = readGallery();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: isBn ? "কালাই ঘর গ্যালারি" : "Kalai Ghor Gallery",
        description: isBn
            ? "চাঁপাইনবাবগঞ্জের কালাই রুটি — রাজশাহীর কালাই ঘরের খাবার, রান্নাঘর ও পরিবেশের ছবি"
            : "Chapainawabganj's kalai ruti — food, kitchen, and ambience at Kalai Ghor in Rajshahi",
        url: `${siteConfig.siteUrl}/${locale}/gallery`,
        author: {
            "@type": "Restaurant",
            name: siteConfig.name,
            address: {
                "@type": "PostalAddress",
                addressLocality: "Rajshahi",
                addressCountry: "BD",
            },
        },
        image: galleryImages.map((img) => ({
            "@type": "ImageObject",
            contentUrl: img.src.startsWith("http") ? img.src : `${siteConfig.siteUrl}${img.src}`,
            name: isBn ? img.captionBn : img.captionEn,
            description: isBn ? img.altBn : img.altEn,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* ── Page header ── */}
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 sm:pt-20 pb-10 sm:pb-14">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-terracotta-500)] mb-3">
                    {isBn ? "ফটোগ্যালারি" : "Photography"}
                </p>
                <h1 className="font-display text-4xl sm:text-6xl font-semibold text-[var(--color-ink)] leading-tight">
                    {isBn ? "কালাই ঘরের দৃশ্য" : "Kalai Ghor in Pictures"}
                </h1>
                <p className="mt-4 text-base text-[var(--color-ink)]/50 max-w-xl leading-relaxed">
                    {isBn
                        ? "তাওয়ার আগুন থেকে খাবার টেবিল পর্যন্ত — রাজশাহীর ঐতিহ্যবাহী কালাই রুটির প্রতিটি মুহূর্ত।"
                        : "From the fire of the tawa to the dining table — every moment of Rajshahi's legendary kalai ruti tradition."}
                </p>
                <div className="mt-6 w-12 h-px bg-[var(--color-terracotta-400)]" />
            </div>

            {/* ── Gallery grid (client component for filters + lightbox) ── */}
            <GalleryGrid items={galleryImages} locale={locale} />
        </>
    );
}
