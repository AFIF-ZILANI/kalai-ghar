import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { siteConfig } from "@content/site-config";
import { getContactData } from "@/lib/server/contact";
import { readMenu } from "@/lib/server/menu";
import { OG_IMAGE, pageAlternates, buildOg } from "@/lib/seo";
import ReserveForm from "./ReserveForm";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const isBn = locale === "bn";
    const t = await getTranslations("reserve");
    const title = `${t("title")} — ${isBn ? "কালাই ঘর" : "Kalai Ghor"}`;
    const description = isBn
        ? "কালাই ঘরে আগাম অর্ডার করুন — নাম, দলের সংখ্যা ও পছন্দের পদ লিখুন, হোয়াটসঅ্যাপে নিশ্চিত করুন।"
        : "Pre-order at Kalai Ghor — fill in your name, party size, and preference. We'll confirm via WhatsApp.";
    return {
        metadataBase: new URL(siteConfig.siteUrl),
        title,
        description,
        alternates: pageAlternates(locale, "/reserve"),
        openGraph: buildOg({ locale, title, description, path: "/reserve", image: OG_IMAGE }),
        twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    };
}

export default async function ReservePage() {
    const locale = await getLocale();
    const t = await getTranslations("reserve");
    const contact = getContactData();
    const menuItems = readMenu();

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-terracotta-700)]">
                    {t("title")}
                </h1>
                <p className="mt-3 text-[var(--color-earth-800)]/70 leading-relaxed">
                    {t("subtitle")}
                </p>
                <div className="w-20 h-1 bg-[var(--color-terracotta-500)] rounded-full mx-auto mt-5" />
            </div>

            <Suspense>
                <ReserveForm locale={locale} whatsapp={contact.whatsapp} menuItems={menuItems} />
            </Suspense>

            <p className="mt-6 text-center text-xs text-[var(--color-earth-800)]/50">
                {t("disclaimer")}
            </p>
        </div>
    );
}
