import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@content/site-config";
import { readGallery } from "@/lib/server/gallery";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations("gallery");
    return {
        metadataBase: new URL(siteConfig.siteUrl),
        title: `${t("title")} — ${locale === "bn" ? "কালাই ঘর" : "Kalai Ghor"}`,
        description: t("subtitle"),
    };
}

const ASPECT_DIMS = {
    landscape: { w: 800, h: 534 },
    square: { w: 800, h: 800 },
    portrait: { w: 640, h: 853 },
};

export default async function GalleryPage() {
    const locale = await getLocale();
    const t = await getTranslations("gallery");
    const galleryImages = readGallery();

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

            {galleryImages.length > 0 ? (
                <div className="columns-2 sm:columns-3 gap-px bg-[var(--color-earth-100)]">
                    {galleryImages.map((img, idx) => {
                        const dims = ASPECT_DIMS[img.aspect];
                        return (
                            <figure key={img.id} className="break-inside-avoid overflow-hidden mb-px">
                                <div className="overflow-hidden bg-[var(--color-earth-50)]">
                                    <Image
                                        src={img.src}
                                        alt={locale === "bn" ? img.altBn : img.altEn}
                                        width={dims.w}
                                        height={dims.h}
                                        className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-700"
                                        loading={idx < 4 ? "eager" : "lazy"}
                                        sizes="(min-width: 640px) 33vw, 50vw"
                                        unoptimized={img.src.startsWith("http")}
                                    />
                                </div>
                                <figcaption className="px-3 py-2 text-[11px] text-[var(--color-ink)]/40 bg-[var(--color-cream)] leading-tight">
                                    {locale === "bn" ? img.captionBn : img.captionEn}
                                </figcaption>
                            </figure>
                        );
                    })}
                </div>
            ) : (
                <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
                    <p className="text-sm text-[var(--color-ink)]/40 italic">
                        {locale === "bn" ? "শীঘ্রই ছবি আসছে।" : "Photos coming soon."}
                    </p>
                </div>
            )}
        </div>
    );
}
