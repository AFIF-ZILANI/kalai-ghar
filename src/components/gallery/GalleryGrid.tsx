"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/lib/server/gallery";

type Category = "all" | "food" | "kitchen" | "ambience" | "people";

const FILTERS: { key: Category; labelEn: string; labelBn: string }[] = [
    { key: "all",      labelEn: "All",      labelBn: "সব" },
    { key: "food",     labelEn: "Food",     labelBn: "খাবার" },
    { key: "kitchen",  labelEn: "Kitchen",  labelBn: "রান্নাঘর" },
    { key: "ambience", labelEn: "Ambience", labelBn: "পরিবেশ" },
    { key: "people",   labelEn: "Guests",   labelBn: "অতিথি" },
];

const ASPECT_DIMS = {
    landscape: { w: 1200, h: 800 },
    square:    { w: 800,  h: 800 },
    portrait:  { w: 800,  h: 1067 },
};

export default function GalleryGrid({ items, locale }: { items: GalleryItem[]; locale: string }) {
    const isBn = locale === "bn";
    const [active, setActive] = useState<Category>("all");
    const [lightbox, setLightbox] = useState<number | null>(null);

    const filtered = active === "all" ? items : items.filter((i) => i.category === active);

    const closeLightbox = useCallback(() => setLightbox(null), []);

    const prev = useCallback(() =>
        setLightbox((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null)),
        [filtered.length]);

    const next = useCallback(() =>
        setLightbox((i) => (i !== null ? (i + 1) % filtered.length : null)),
        [filtered.length]);

    useEffect(() => {
        if (lightbox === null) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [lightbox, closeLightbox, prev, next]);

    useEffect(() => {
        document.body.style.overflow = lightbox !== null ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [lightbox]);

    const currentItem = lightbox !== null ? filtered[lightbox] : null;

    return (
        <>
            {/* ── Filter tabs ── */}
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
                <div className="flex flex-wrap gap-2">
                    {FILTERS.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => { setActive(f.key); setLightbox(null); }}
                            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors border ${
                                active === f.key
                                    ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                                    : "bg-transparent text-[var(--color-ink)]/50 border-[var(--color-ink)]/15 hover:border-[var(--color-ink)]/40 hover:text-[var(--color-ink)]"
                            }`}
                        >
                            {isBn ? f.labelBn : f.labelEn}
                        </button>
                    ))}
                    <span className="ml-auto self-center text-xs text-[var(--color-ink)]/30">
                        {filtered.length} {isBn ? "টি ছবি" : "photos"}
                    </span>
                </div>
            </div>

            {/* ── Masonry grid ── */}
            {filtered.length === 0 ? (
                <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20 text-center">
                    <p className="text-sm text-[var(--color-ink)]/40 italic">
                        {isBn ? "এই বিভাগে কোনো ছবি নেই।" : "No photos in this category."}
                    </p>
                </div>
            ) : (
                <div className="columns-2 sm:columns-3 lg:columns-3 gap-1 px-1 sm:px-1">
                    {filtered.map((img, idx) => {
                        const dims = ASPECT_DIMS[img.aspect];
                        return (
                            <figure
                                key={img.id}
                                className="break-inside-avoid mb-1 overflow-hidden group relative cursor-pointer"
                                onClick={() => setLightbox(idx)}
                            >
                                <div className="relative overflow-hidden bg-[var(--color-earth-100)]">
                                    <Image
                                        src={img.src}
                                        alt={isBn ? img.altBn : img.altEn}
                                        width={dims.w}
                                        height={dims.h}
                                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 33vw, 50vw"
                                        className="w-full h-auto object-cover group-hover:scale-[1.04] transition-transform duration-700"
                                        loading={idx < 6 ? "eager" : "lazy"}
                                        unoptimized={img.src.startsWith("http")}
                                    />
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-[var(--color-ink)]/0 group-hover:bg-[var(--color-ink)]/40 transition-colors duration-300 flex items-end">
                                        <p className="w-full px-3 py-2.5 text-[11px] font-medium text-white translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 leading-tight">
                                            {isBn ? img.captionBn : img.captionEn}
                                        </p>
                                    </div>
                                </div>
                            </figure>
                        );
                    })}
                </div>
            )}

            {/* ── Lightbox ── */}
            {lightbox !== null && currentItem && (
                <div
                    className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close */}
                    <button
                        onClick={closeLightbox}
                        aria-label="Close"
                        className="absolute top-4 right-4 z-10 p-2 text-white/60 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/40 text-xs font-medium tracking-widest">
                        {lightbox + 1} / {filtered.length}
                    </div>

                    {/* Prev */}
                    <button
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        aria-label="Previous"
                        className="absolute left-3 sm:left-6 z-10 p-2 text-white/50 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={36} />
                    </button>

                    {/* Image */}
                    <div
                        className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-3"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative max-h-[78vh]">
                            <Image
                                src={currentItem.src}
                                alt={isBn ? currentItem.altBn : currentItem.altEn}
                                width={ASPECT_DIMS[currentItem.aspect].w}
                                height={ASPECT_DIMS[currentItem.aspect].h}
                                className="max-h-[78vh] w-auto object-contain"
                                unoptimized={currentItem.src.startsWith("http")}
                                priority
                            />
                        </div>
                        <p className="text-white/60 text-sm text-center max-w-md leading-relaxed">
                            {isBn ? currentItem.captionBn : currentItem.captionEn}
                        </p>
                    </div>

                    {/* Next */}
                    <button
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        aria-label="Next"
                        className="absolute right-3 sm:right-6 z-10 p-2 text-white/50 hover:text-white transition-colors"
                    >
                        <ChevronRight size={36} />
                    </button>
                </div>
            )}
        </>
    );
}
