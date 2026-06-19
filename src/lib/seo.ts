import { siteConfig } from "@content/site-config";

export const OG_IMAGE = {
    url: "/og-image.jpg",
    width: 2000,
    height: 1128,
    alt: "Kalai Ghor — Chapainawabganj's famous kalai ruti, served in Rajshahi, Bangladesh",
} as const;

/** Canonical URL + hreflang alternates for a given locale + path segment. */
export function pageAlternates(locale: string, path: string) {
    const base = siteConfig.siteUrl;
    const seg = path === "/" ? "" : path;
    return {
        canonical: `${base}/${locale}${seg}`,
        languages: {
            "bn": `${base}/bn${seg}`,
            "en": `${base}/en${seg}`,
            "x-default": `${base}/bn${seg}`,
        },
    };
}

/** Standard openGraph block, caller supplies overrides. */
export function buildOg({
    locale,
    title,
    description,
    path,
    image = OG_IMAGE,
}: {
    locale: string;
    title: string;
    description: string;
    path: string;
    image?: typeof OG_IMAGE;
}) {
    const seg = path === "/" ? "" : path;
    return {
        title,
        description,
        url: `${siteConfig.siteUrl}/${locale}${seg}`,
        siteName: siteConfig.name,
        images: [image],
        locale: locale === "bn" ? "bn_BD" : "en_US",
        type: "website" as const,
    };
}
