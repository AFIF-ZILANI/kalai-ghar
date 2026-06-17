import type { Metadata } from "next";
import { Inter, Hind_Siliguri, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@i18n/routing";
import { siteConfig } from "@content/site-config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import "../globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const hindSiliguri = Hind_Siliguri({
    subsets: ["bengali", "latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-hind-siliguri",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    style: ["normal", "italic"],
    variable: "--font-playfair",
    display: "swap",
});

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata" });

    const alternates = {
        canonical: `${siteConfig.siteUrl}/${locale}`,
        languages: {
            bn: `${siteConfig.siteUrl}/bn`,
            en: `${siteConfig.siteUrl}/en`,
        },
    };

    return {
        metadataBase: new URL(siteConfig.siteUrl),
        title: t("title"),
        description: t("description"),
        alternates,
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            url: `${siteConfig.siteUrl}/${locale}`,
            siteName: siteConfig.name,
            images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
            locale: locale === "bn" ? "bn_BD" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: t("ogTitle"),
            description: t("ogDescription"),
            images: [siteConfig.ogImage],
        },
    };
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const messages = await getMessages();

    const fontClass =
        locale === "bn"
            ? `${hindSiliguri.variable} ${inter.variable} ${playfair.variable}`
            : `${inter.variable} ${hindSiliguri.variable} ${playfair.variable}`;

    return (
        <html lang={locale} className={`${fontClass} h-full scroll-smooth antialiased`}>
            <body className="min-h-full flex flex-col bg-[var(--color-cream)] text-[var(--color-ink)]">
                <NextIntlClientProvider messages={messages}>
                    <Header locale={locale} />
                    <main className="flex-1 pb-20 md:pb-0">{children}</main>
                    <Footer />
                    <MobileBottomBar />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
