import type { MetadataRoute } from "next";
import { siteConfig } from "@content/site-config";

const pages = ["", "/menu", "/story", "/visit", "/reserve", "/gallery"];
const locales = ["bn", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = [];

    for (const locale of locales) {
        for (const page of pages) {
            entries.push({
                url: `${siteConfig.siteUrl}/${locale}${page}`,
                lastModified: new Date(),
                changeFrequency: page === "" ? "weekly" : "monthly",
                priority: page === "" ? 1 : 0.8,
            });
        }
    }

    return entries;
}
