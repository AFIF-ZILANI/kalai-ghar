import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { siteConfig } from "@content/site-config";
import ReserveForm from "./ReserveForm";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations("reserve");
    return {
        metadataBase: new URL(siteConfig.siteUrl),
        title: `${t("title")} — ${locale === "bn" ? "কালাই ঘর" : "Kalai Ghor"}`,
        description: t("subtitle"),
    };
}

export default async function ReservePage() {
    const locale = await getLocale();
    const t = await getTranslations("reserve");

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

            <ReserveForm locale={locale} whatsapp={siteConfig.whatsapp} />

            <p className="mt-6 text-center text-xs text-[var(--color-earth-800)]/50">
                {t("disclaimer")}
            </p>
        </div>
    );
}
